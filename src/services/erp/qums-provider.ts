
import { IERPProvider } from './interface';
import { StudentProfile } from '@/types/student';
import { ERPAuthResponse } from '@/types/erp';
import * as cheerio from 'cheerio';

const QUMS_BASE_URL = 'https://qums.quantumuniversity.edu.in';

/**
 * QUMS Provider implementation for real-world ERP integration.
 * Handles session correlation, CSRF extraction, and identity mapping.
 */
export class QUMSProvider implements IERPProvider {
  /**
   * Initializes a session by fetching the root page and extracting CSRF tokens.
   * Captures ALL cookies returned by QUMS to maintain session integrity.
   */
  async initializeSession() {
    // 1. Establish session and get CSRF token from the login page
    const response = await fetch(QUMS_BASE_URL);
    const html = await response.text();
    
    // Extract all set-cookie headers (Next.js/Standard Fetch style)
    // We need all cookies (Session ID, CSRF cookies, etc.)
    const cookies = this.extractCookies(response);

    const $ = cheerio.load(html);
    const token = $('input[name="__RequestVerificationToken"]').val() as string;

    // 2. Retrieve CAPTCHA using the SAME cookies
    const captchaResponse = await fetch(`${QUMS_BASE_URL}/Account/GetCaptcha`, {
      headers: { 
        'Cookie': cookies,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const contentType = captchaResponse.headers.get('content-type') || '';
    
    // Diagnostics (Safe)
    console.log(`[QUMS-INIT] Upstream Status: ${captchaResponse.status}, Cookies captured: ${!!cookies}, CSRF Token found: ${!!token}`);

    let captchaDataUri = '';
    const buffer = await captchaResponse.arrayBuffer();
    const textData = Buffer.from(buffer).toString('utf-8');

    // Handle data-URI vs binary response
    if (textData.startsWith('data:')) {
      captchaDataUri = textData;
    } else {
      const b64 = Buffer.from(buffer).toString('base64');
      captchaDataUri = `data:${contentType || 'image/png'};base64,${b64}`;
    }

    // The sessionId returned to the API route is the FULL cookie string
    return { sessionId: cookies, token, captchaDataUri };
  }

  /**
   * Authenticates the student using the root URL (/) as per actual QUMS behavior.
   */
  async authenticate(username: string, password: string, captcha: string, token: string, sessionId: string): Promise<ERPAuthResponse> {
    const body = new URLSearchParams({
      hdnMsg: '',
      checkOnline: 'false',
      __RequestVerificationToken: token,
      UserName: username,
      Password: password,
      clientIP: '127.0.0.1',
      captcha: captcha
    });

    // Real QUMS login is a POST to the root URL (/)
    const response = await fetch(QUMS_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': sessionId,
        'Referer': QUMS_BASE_URL,
        'Origin': QUMS_BASE_URL,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      body: body.toString(),
      redirect: 'manual'
    });

    // Capture any updated cookies after login
    const updatedCookies = this.mergeCookies(sessionId, this.extractCookies(response));

    // Success check based on 302 redirect
    console.log(`[QUMS-AUTH] Result Status: ${response.status}, Success: ${response.status === 302}`);

    if (response.status === 302) {
      return { success: true, sessionId: updatedCookies };
    }

    const failureHtml = await response.text();
    const isInvalid = failureHtml.includes('Invalid') || failureHtml.includes('Incorrect');
    
    return { 
      success: false, 
      message: isInvalid ? 'Invalid QID or Password.' : 'Authentication failed. Please verify CAPTCHA.' 
    };
  }

  /**
   * Retrieves student profile using POST to /Account/GetStudentDetail
   */
  async getStudentProfile(sessionId: string): Promise<StudentProfile> {
    const response = await fetch(`${QUMS_BASE_URL}/Account/GetStudentDetail`, {
      method: 'POST',
      headers: { 
        'Cookie': sessionId,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.log(`[QUMS-PROFILE] Failed: ${response.status}`);
      throw new Error('QUMS session expired');
    }

    const data = await response.json();
    
    // Map required fields: EnrollmentNo is the unique QID used by students
    return {
      uid: data.RegID || '',
      studentId: data.StudentID || '',
      registrationId: data.RegID || '',
      enrollmentNo: data.EnrollmentNo || '', 
      name: data.StudentName || '',
      course: data.Course || '',
      branch: data.Branch || '',
      section: data.Section || '',
      semester: parseInt(data.YearSem) || 0,
      photoUrl: data.Photo || ''
    };
  }

  async logout(sessionId: string): Promise<void> {
    await fetch(`${QUMS_BASE_URL}/Account/Logout`, {
      method: 'POST',
      headers: { 'Cookie': sessionId }
    });
  }

  /**
   * Robustly extracts and combines all cookies from a response.
   */
  private extractCookies(response: Response): string {
    // getSetCookie() is available in Next.js 15 (Node 18+ fetch)
    const setCookies = (response.headers as any).getSetCookie?.() || [];
    if (setCookies.length > 0) {
      return setCookies.map((c: string) => c.split(';')[0]).join('; ');
    }
    
    // Fallback for older environments
    const cookieHeader = response.headers.get('set-cookie');
    return cookieHeader ? cookieHeader.split(';')[0] : '';
  }

  /**
   * Merges existing cookies with new ones from a response.
   */
  private mergeCookies(existing: string, incoming: string): string {
    if (!incoming) return existing;
    const cookies = new Map();
    existing.split(';').forEach(c => {
      const [k, v] = c.split('=').map(s => s.trim());
      if (k) cookies.set(k, v);
    });
    incoming.split(';').forEach(c => {
      const [k, v] = c.split('=').map(s => s.trim());
      if (k) cookies.set(k, v);
    });
    return Array.from(cookies.entries()).map(([k, v]) => `${k}=${v}`).join('; ');
  }
}
