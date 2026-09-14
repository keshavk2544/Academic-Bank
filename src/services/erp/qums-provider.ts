
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
      const imgPhoto = $('#imgPhoto');
      let captchaSrc = imgPhoto.attr('src') || '';
      
      let captchaDataUri = '';

      if (captchaSrc) {
        if (captchaSrc.startsWith('data:')) {
          captchaDataUri = captchaSrc.replace('application/octet-stream', 'image/png');
        } else {
          const captchaUrl = new URL(captchaSrc, QUMS_BASE_URL).toString();
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
            const safeType = contentType.includes('octet-stream') ? 'image/png' : contentType;
            captchaDataUri = `data:${safeType};base64,${Buffer.from(buffer).toString('base64')}`;
          }
        }
      }

      if (!captchaDataUri) {
        throw new Error('ERP CAPTCHA source unavailable');
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
        'User-Agent': this.userAgent
      },
      body: body.toString(),
      redirect: 'manual'
    });

    const updatedCookies = this.mergeCookies(sessionId, this.extractCookies(response));

    if (response.status === 302 || response.status === 301) {
      return { success: true, sessionId: updatedCookies };
    }

    const failureHtml = await response.text();
    const isInvalid = failureHtml.includes('Invalid') || failureHtml.includes('Incorrect');
    const isCaptchaError = failureHtml.includes('Captcha') || failureHtml.includes('CAPTCHA');
    
    return { 
      success: false, 
      message: isInvalid ? 'Invalid QID or Password.' : 
               isCaptchaError ? 'Invalid CAPTCHA code.' : 
               'Authentication failed. Please verify credentials.' 
    };
  }

  async getStudentProfile(sessionId: string): Promise<StudentProfile> {
    const response = await fetch(`${QUMS_BASE_URL}/Account/GetStudentDetail`, {
      method: 'POST',
      headers: { 
        'Cookie': sessionId,
        'User-Agent': this.userAgent,
        'Referer': `${QUMS_BASE_URL}/Student/Dashboard`,
        'Accept': 'application/json, text/plain, */*'
      },
      cache: 'no-store'
    });

    const rawText = await response.text();

    console.log('[QUMS-PROFILE-RESPONSE]', {
      status: response.status,
      contentType: response.headers.get('content-type'),
      length: rawText.length,
      looksLikeHtml: rawText.trimStart().startsWith('<')
    });

    if (!response.ok) {
      throw new Error(`QUMS profile request failed with HTTP ${response.status}`);
    }

    let rawData: any;
    try {
      rawData = JSON.parse(rawText);
    } catch {
      throw new Error(`QUMS GetStudentDetail returned non-JSON data. HTTP ${response.status}`);
    }

    let data: any;
    let format: string = 'unknown';

    if (rawData && typeof rawData.state === 'string') {
      format = 'state_string';
      try {
        const parsedState = JSON.parse(rawData.state);
        data = Array.isArray(parsedState) ? parsedState[0] : parsedState;
      } catch {
        throw new Error('Failed to parse the "state" property in QUMS response.');
      }
    } else {
      format = 'direct_object';
      data = Array.isArray(rawData) ? rawData[0] : rawData;
    }

    if (!data) {
      throw new Error('QUMS profile data is empty or null.');
    }

    // Process Photo Base64 string into a valid Data URL
    const photo = data.Photo || '';
    const photoUrl = photo
      ? (photo.startsWith('data:')
          ? photo
          : `data:image/png;base64,${photo}`)
      : '';

    console.log('[PROFILE TEST]', {
      success: true,
      responseFormat: format,
      hasStudentName: !!data.StudentName,
      hasStudentID: !!data.StudentID,
      hasRegID: !!data.RegID,
      hasCourse: !!data.Course,
      hasBranch: !!data.Branch,
      hasSection: !!data.Section,
      hasYearSem: !!data.YearSem,
      hasPhoto: !!data.Photo,
      photoLength: typeof data.Photo === 'string' ? data.Photo.length : 0
    });
    
    return {
      uid: data.RegID || '',
      studentId: data.StudentID || '',
      registrationId: data.RegID || '',
      enrollmentNo: data.EnrollmentNo || data.StudentID || '',
      name: data.StudentName || '',
      course: data.Course || '',
      branch: data.Branch || '',
      section: data.Section || '',
      semester: parseInt(data.YearSem) || 0,
      photoUrl: photoUrl
    };
  }

  async logout(sessionId: string): Promise<void> {
    try {
      await fetch(`${QUMS_BASE_URL}/Account/Logout`, {
        method: 'POST',
        headers: { 'Cookie': sessionId, 'User-Agent': this.userAgent }
      });
    } catch (e) {}
  }

  private extractCookies(response: Response): string {
    if (typeof (response.headers as any).getSetCookie === 'function') {
      const cookies = (response.headers as any).getSetCookie();
      if (cookies.length > 0) {
        return cookies.map((c: string) => c.split(';')[0].trim()).join('; ');
      }
    }
    const cookieHeader = response.headers.get('set-cookie');
    if (!cookieHeader) return '';
    return cookieHeader.split(',').map(c => c.split(';')[0].trim()).join('; ');
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
