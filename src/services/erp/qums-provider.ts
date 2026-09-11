
import { IERPProvider } from './interface';
import { StudentProfile } from '@/types/student';
import { ERPAuthResponse } from '@/types/erp';
import * as cheerio from 'cheerio';

const QUMS_BASE_URL = 'https://qums.quantumuniversity.edu.in';

export class QUMSProvider implements IERPProvider {
  async initializeSession() {
    const response = await fetch(QUMS_BASE_URL);
    const html = await response.text();
    const cookies = this.extractCookies(response);

    const $ = cheerio.load(html);
    const token = $('input[name="__RequestVerificationToken"]').val() as string;

    const captchaResponse = await fetch(`${QUMS_BASE_URL}/Account/GetCaptcha`, {
      headers: { 
        'Cookie': cookies,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const contentType = captchaResponse.headers.get('content-type') || '';
    const buffer = await captchaResponse.arrayBuffer();
    const textData = Buffer.from(buffer).toString('utf-8');

    let captchaDataUri = '';
    if (textData.startsWith('data:')) {
      captchaDataUri = textData;
    } else {
      const b64 = Buffer.from(buffer).toString('base64');
      captchaDataUri = `data:${contentType || 'image/png'};base64,${b64}`;
    }

    // Capture updated cookies if any after captcha request
    const finalCookies = this.mergeCookies(cookies, this.extractCookies(captchaResponse));

    return { sessionId: finalCookies, token, captchaDataUri };
  }

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

    const updatedCookies = this.mergeCookies(sessionId, this.extractCookies(response));

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

  async getStudentProfile(sessionId: string): Promise<StudentProfile> {
    const response = await fetch(`${QUMS_BASE_URL}/Account/GetStudentDetail`, {
      method: 'POST',
      headers: { 
        'Cookie': sessionId,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) throw new Error('QUMS session expired');

    const data = await response.json();
    
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

  private extractCookies(response: Response): string {
    const setCookies = (response.headers as any).getSetCookie?.() || [];
    if (setCookies.length > 0) {
      return setCookies.map((c: string) => c.split(';')[0]).join('; ');
    }
    const cookieHeader = response.headers.get('set-cookie');
    return cookieHeader ? cookieHeader.split(';')[0] : '';
  }

  private mergeCookies(existing: string, incoming: string): string {
    if (!incoming) return existing;
    const cookies = new Map();
    existing.split(';').forEach(c => {
      const [k, v] = c.split('=').map(s => s.trim());
      if (k && v !== undefined) cookies.set(k, v);
    });
    incoming.split(';').forEach(c => {
      const [k, v] = c.split('=').map(s => s.trim());
      if (k && v !== undefined) cookies.set(k, v);
    });
    return Array.from(cookies.entries()).map(([k, v]) => `${k}=${v}`).join('; ');
  }
}
