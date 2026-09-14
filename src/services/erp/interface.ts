
import { StudentProfile } from '@/types/student';
import { ERPAuthResponse } from '@/types/erp';

export interface IERPProvider {
  /**
   * Initializes a fresh QUMS session and returns the CSRF token and CAPTCHA.
   */
  initializeSession(): Promise<{ sessionId: string; token: string; captchaDataUri: string }>;

  /**
   * Authenticates the student with QUMS.
   */
  authenticate(
    username: string,
    password: string,
    captcha: string,
    token: string,
    sessionId: string
  ): Promise<ERPAuthResponse>;

  /**
   * Retrieves the student's authorized profile information.
   */
  getStudentProfile(sessionId: string): Promise<StudentProfile>;

  /**
   * Retrieves the raw student photo as a Buffer.
   */
  getStudentPhoto(sessionId: string): Promise<Buffer | null>;

  /**
   * Invalidates the ERP session.
   */
  logout(sessionId: string): Promise<void>;
}
