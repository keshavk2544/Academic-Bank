import { StudentProfile, AttendanceRecord } from '@/types/student';
import { ERPAuthResponse } from '@/types/erp';

/**
 * The standard interface for any ERP provider implementation.
 */
export interface IERPProvider {
  /**
   * Authenticates the student with the ERP.
   * Note: Password is never stored beyond this request.
   */
  authenticate(username: string, password: string, captcha?: string): Promise<ERPAuthResponse>;

  /**
   * Retrieves the student's profile information.
   */
  getStudentProfile(sessionId: string): Promise<StudentProfile>;

  /**
   * Retrieves the student's attendance data.
   */
  getAttendance(sessionId: string): Promise<AttendanceRecord[]>;

  /**
   * Destroys the ERP session.
   */
  logout(sessionId: string): Promise<void>;
}
