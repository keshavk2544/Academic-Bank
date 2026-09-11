
import { IERPProvider } from './interface';
import { StudentProfile } from '@/types/student';
import { ERPAuthResponse } from '@/types/erp';
import * as cheerio from 'cheerio';

const QUMS_BASE_URL = 'https://qums.quantumuniversity.edu.in';

export class QUMSProvider implements IERPProvider {
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  async initializeSession() {
    try {
      console.log(`[QUMS-INIT] Fetching landing page: ${QUMS_BASE_URL}`);
      const response = await fetch(QUMS_BASE_URL, {
        headers: { 
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        console.error(`[QUMS-INIT] Landing page failed: ${response.status}`);
        throw new Error(`QUMS unreachable: ${response.status}`);
      }
      
      const html = await response.text();
      const cookies = this.extractCookies(response);
      const $ = cheerio.load(html);
      
      const token = $('input[name="__RequestVerificationToken"]').val() as string;
      console.log(`[QUMS-INIT] CSRF Token found: ${!!token}`);

      // Attempt to extract CAPTCHA from the landing page HTML element #imgPhoto
      const imgPhoto = $('#imgPhoto');
      let captchaSrc = imgPhoto.attr('src') || '';
      console.log(`[QUMS-INIT] #imgPhoto src found: "${captchaSrc.substring(0, 50)}..."`);

      let captchaDataUri = '';

      if (captchaSrc) {
        if (captchaSrc.startsWith('data:')) {
          console.log(`[QUMS-INIT] Found direct data-URI captcha`);
          captchaDataUri = captchaSrc.replace('application/octet-stream', 'image/png');
        } else {
          // Resolve relative URL
          const captchaUrl = new URL(captchaSrc, QUMS_BASE_URL).toString();
          console.log(`[QUMS-INIT] Fetching relative CAPTCHA URL: ${captchaUrl}`);
          
          const captchaRes = await fetch(captchaUrl, { 
            headers: { 
              'Cookie': cookies,
              'User-Agent': this.userAgent,
              'Referer': QUMS_BASE_URL
            },
            cache: 'no-store'
          });

          if (captchaRes.ok) {
            const buffer = await captchaRes.arrayBuffer();
            const contentType = captchaRes.headers.get('content-type') || 'image/png';
            captchaDataUri = `data:${contentType};base64,${Buffer.from(buffer).toString('base64')}`;
            console.log(`[QUMS-INIT] CAPTCHA fetched successfully. Size: ${buffer.byteLength}`);
          } else {
            console.warn(`[QUMS-INIT] Failed to fetch relative CAPTCHA URL: ${captchaRes.status}`);
          }
        }
      }

      // Fallback if still no captcha
      if (!captchaDataUri) {
        console.log(`[QUMS-INIT] Falling back to explicit /Account/GetCaptcha`);
        const fallbackUrl = `${QUMS_BASE_URL}/Account/GetCaptcha`;
        const captchaResponse = await fetch(fallbackUrl, {
          headers: { 
            'Cookie': cookies,
            'User-Agent': this.userAgent,
            'Referer': QUMS_BASE_URL
          },
          cache: 'no-store'
        });

        if (captchaResponse.ok) {
          const buffer = await captchaResponse.arrayBuffer();
          const contentType = captchaResponse.headers.get('content-type') || 'image/png';
          captchaDataUri = `data:${contentType};base64,${Buffer.from(buffer).toString('base64')}`;
          console.log(`[QUMS-INIT] Fallback CAPTCHA fetched. Size: ${buffer.byteLength}`);
        }
      }

      if (!captchaDataUri) {
        throw new Error('ERP CAPTCHA Image Empty');
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

    console.log(`[QUMS-LOGIN] Submitting login request to root...`);
    const response = await fetch(QUMS_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': sessionId,
        'Referer': QUMS_BASE_URL,
        'Origin': QUMS_BASE_URL,
        'User-Agent': this.userAgent
      },
      body: body.toString(),
      redirect: 'manual'
    });

    const updatedCookies = this.mergeCookies(sessionId, this.extractCookies(response));

    // QUMS redirects (302) to /Student/Dashboard on success
    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get('location');
      console.log(`[QUMS-LOGIN] Success! Redirecting to: ${location}`);
      return { success: true, sessionId: updatedCookies };
    }

    const failureHtml = await response.text();
    const isInvalid = failureHtml.includes('Invalid') || failureHtml.includes('Incorrect');
    const isCaptchaError = failureHtml.includes('Captcha') || failureHtml.includes('CAPTCHA');
    const isSessionExpired = failureHtml.includes('expired') || failureHtml.includes('Verification Token');
    
    console.warn(`[QUMS-LOGIN] Failed status ${response.status}. flags: invalid=${isInvalid}, captcha=${isCaptchaError}, expired=${isSessionExpired}`);

    return { 
      success: false, 
      message: isInvalid ? 'Invalid QID or Password.' : 
               isCaptchaError ? 'Invalid CAPTCHA code.' : 
               isSessionExpired ? 'Authentication session expired. Refresh CAPTCHA.' :
               'Authentication failed. Please verify all fields.' 
    };
  }

  async getStudentProfile(sessionId: string): Promise<StudentProfile> {
    console.log(`[QUMS-PROFILE] Fetching student detail...`);
    const response = await fetch(`${QUMS_BASE_URL}/Account/GetStudentDetail`, {
      method: 'POST',
      headers: { 
        'Cookie': sessionId,
        'User-Agent': this.userAgent,
        'Referer': `${QUMS_BASE_URL}/Student/Dashboard`
      }
    });

    if (!response.ok) {
      console.error(`[QUMS-PROFILE] Failed to fetch profile: ${response.status}`);
      throw new Error('QUMS session expired');
    }

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
        headers: { 'Cookie': sessionId, 'User-Agent': this.userAgent }
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
