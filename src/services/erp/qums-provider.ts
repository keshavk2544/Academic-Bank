
import { IERPProvider } from './interface';
import { StudentProfile } from '@/types/student';
import { ERPAuthResponse } from '@/types/erp';
import * as cheerio from 'cheerio';

const QUMS_BASE_URL = 'https://qums.quantumuniversity.edu.in';

export class QUMSProvider implements IERPProvider {
  async initializeSession() {
    // 1. Establish session and get CSRF token
    const response = await fetch(QUMS_BASE_URL);
    const html = await response.text();
    const setCookie = response.headers.get('set-cookie') || '';
    const sessionId = setCookie.split(';')[0];

    const $ = cheerio.load(html);
    const token = $('input[name="__RequestVerificationToken"]').val() as string;

    // 2. Retrieve CAPTCHA using the SAME session
    const captchaResponse = await fetch(`${QUMS_BASE_URL}/Account/GetCaptcha`, {
      headers: { Cookie: sessionId }
    });

    const contentType = captchaResponse.headers.get('content-type') || '';
    const contentLength = captchaResponse.headers.get('content-length') || '0';
    
    // Diagnostic logging (Safe fields only)
    console.log(`QUMS CAPTCHA status: ${captchaResponse.status}`);
    console.log(`QUMS CAPTCHA content-type: ${contentType}`);
    console.log(`QUMS CAPTCHA response length: ${contentLength} bytes`);

    let captchaDataUri = '';
    
    // Check if the ERP returned a data URI string directly
    const buffer = await captchaResponse.arrayBuffer();
    const textData = Buffer.from(buffer).toString('utf-8');

    if (textData.startsWith('data:')) {
      // ERP returned a string data URI
      captchaDataUri = textData;
    } else {
      // ERP returned binary image data
      const b64 = Buffer.from(buffer).toString('base64');
      captchaDataUri = `data:${contentType || 'image/png'};base64,${b64}`;
    }

    return { sessionId, token, captchaDataUri };
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

    const response = await fetch(`${QUMS_BASE_URL}/Account/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': sessionId
      },
      body: body.toString(),
      redirect: 'manual'
    });

    if (response.status === 302) {
      return { success: true, sessionId };
    }

    return { success: false, message: 'Invalid credentials or CAPTCHA pulse.' };
  }

  async getStudentProfile(sessionId: string): Promise<StudentProfile> {
    const response = await fetch(`${QUMS_BASE_URL}/Account/GetStudentDetail`, {
      method: 'POST',
      headers: { Cookie: sessionId }
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
      headers: { Cookie: sessionId }
    });
  }
}
