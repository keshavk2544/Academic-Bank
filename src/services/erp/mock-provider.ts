
import { IERPProvider } from './interface';
import { StudentProfile } from '@/types/student';
import { ERPAuthResponse } from '@/types/erp';

/**
 * Mock implementation of the ERP provider for safe development.
 */
export class MockERPProvider implements IERPProvider {
  async initializeSession() {
    return {
      sessionId: 'mock_session',
      token: 'mock_token',
      captchaDataUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
    };
  }

  async authenticate(username: string, password: string): Promise<ERPAuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (username.toLowerCase() === 'admin' || username.toLowerCase() === 'test') {
      return { 
        success: true, 
        sessionId: 'mock_session_' + Math.random().toString(36).substring(7) 
      };
    }
    return { 
      success: false, 
      message: 'Invalid credentials Pulse.' 
    };
  }

  async getStudentProfile(sessionId: string): Promise<StudentProfile> {
    return {
      uid: 'u_mock_123',
      studentId: 'QID2024001',
      registrationId: 'REG998877',
      enrollmentNo: '22CSE1042',
      name: 'Keshav Krishan',
      course: 'Bachelor of Technology',
      branch: 'Computer Science and Engineering',
      section: 'B',
      semester: 6,
      photoUrl: '/api/student/photo'
    };
  }

  async getStudentPhoto(sessionId: string): Promise<Buffer | null> {
    return Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  }

  async logout(sessionId: string): Promise<void> {
    return Promise.resolve();
  }
}
