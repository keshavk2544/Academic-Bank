
import { IERPProvider } from './interface';
import { StudentProfile } from '@/types/student';
import { ERPAuthResponse } from '@/types/erp';
import * as cheerio from 'cheerio';

const QUMS_BASE_URL = 'https://qums.quantumuniversity.edu.in';

export class QUMSProvider implements IERPProvider {
  async initializeSession() {
    try {
      const response = await fetch(QUMS_BASE_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) throw new Error(`QUMS landing page unreachable: ${response.status}`);
      
      const html = await response.text();
      const cookies = this.extractCookies(response);

      const $ = cheerio.load(html);
      const token = $('input[name="__RequestVerificationToken"]').val() as string;
      
      // Attempt to extract CAPTCHA directly from landing page HTML if present
      let captchaDataUri = $('#imgPhoto').attr('src') || '';

      if (captchaDataUri && !captchaDataUri.startsWith('data:')) {
        const captchaUrl = new URL(captchaDataUri, QUMS_BASE_URL).toString();
        const captchaRes = await fetch(captchaUrl, { 
          headers: { 
            'Cookie': cookies,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          } 
        });
        const buffer = await captchaRes.arrayBuffer();
        const contentType = captchaRes.headers.get('content-type') || 'image/png';
        captchaDataUri = `data:${contentType};base64,${Buffer.from(buffer).toString('base64')}`;
      } else if (!captchaDataUri) {
        // Fallback to explicit captcha endpoint
        const captchaResponse = await fetch(`${QUMS_BASE_URL}/Account/GetCaptcha`, {
          headers: { 
            'Cookie': cookies,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        const buffer = await captchaResponse.arrayBuffer();
        const contentType = captchaResponse.headers.get('content-type') || 'image/png';
        captchaDataUri = `data:${contentType};base64,${Buffer.from(buffer).toString('base64')}`;
      }

      return { sessionId: cookies, token, captchaDataUri };
    } catch (error) {
      console.error('[QUMS-INIT-ERROR]', error);
      throw error;
    }
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

    // QUMS redirects to /Student/Dashboard on success
    if (response.status === 302) {
      return { success: true, sessionId: updatedCookies };
    }

    const failureHtml = await response.text();
    const isInvalid = failureHtml.includes('Invalid') || failureHtml.includes('Incorrect');
    const isCaptchaError = failureHtml.includes('Captcha') || failureHtml.includes('CAPTCHA');
    
    return { 
      success: false, 
      message: isInvalid ? 'Invalid QID or Password.' : 
               isCaptchaError ? 'Invalid CAPTCHA code.' : 
               'Authentication failed. Please verify all fields.' 
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
    try {
      await fetch(`${QUMS_BASE_URL}/Account/Logout`, {
        method: 'POST',
        headers: { 'Cookie': sessionId }
      });
    } catch (e) {
      // Ignore
    }
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
      const parts = c.split('=');
      const k = parts[0]?.trim();
      const v = parts.slice(1).join('=')?.trim();
      if (k && v !== undefined) cookies.set(k, v);
    });
    incoming.split(';').forEach(c => {
      const parts = c.split('=');
      const k = parts[0]?.trim();
      const v = parts.slice(1).join('=')?.trim();
      if (k && v !== undefined) cookies.set(k, v);
    });
    return Array.from(cookies.entries()).map(([k, v]) => `${k}=${v}`).join('; ');
  }
}
