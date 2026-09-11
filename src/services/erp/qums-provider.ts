
import { IERPProvider } from './interface';
import { StudentProfile } from '@/types/student';
import { ERPAuthResponse } from '@/types/erp';
import * as cheerio from 'cheerio';

const QUMS_BASE_URL = 'https://qums.quantumuniversity.edu.in';

export class QUMSProvider implements IERPProvider {
  async initializeSession() {
    const response = await fetch(QUMS_BASE_URL);
    const html = await response.text();
    const cookies = response.headers.get('set-cookie') || '';
    const sessionId = cookies.split(';')[0];

    const $ = cheerio.load(html);
    const token = $('input[name="__RequestVerificationToken"]').val() as string;

    const captchaResponse = await fetch(`${QUMS_BASE_URL}/Account/GetCaptcha`, {
      headers: { Cookie: sessionId }
    });
    const captchaBuffer = await captchaResponse.arrayBuffer();
    const captchaDataUri = `data:image/png;base64,${Buffer.from(captchaBuffer).toString('base64')}`;

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

    // QUMS redirects to /Account/Index on success
    if (response.status === 302) {
      return { success: true, sessionId };
    }

    return { success: false, message: 'Invalid credentials or CAPTCHA.' };
  }

  async getStudentProfile(sessionId: string): Promise<StudentProfile> {
    const response = await fetch(`${QUMS_BASE_URL}/Account/GetStudentDetail`, {
      method: 'POST',
      headers: { Cookie: sessionId }
    });

    if (!response.ok) throw new Error('QUMS session expired');

    const data = await response.json();
    
    // Extracting specifically requested fields: Name, QID (EnrollmentNo), Course, Section
    return {
      uid: data.RegID || '',
      studentId: data.StudentID || '',
      registrationId: data.RegID || '',
      enrollmentNo: data.EnrollmentNo || '', // This is the student's QID
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
