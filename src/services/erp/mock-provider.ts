import { IERPProvider } from './interface';
import { StudentProfile, AttendanceRecord } from '@/types/student';
import { ERPAuthResponse } from '@/types/erp';

/**
 * Mock implementation of the ERP provider for safe development.
 */
export class MockERPProvider implements IERPProvider {
  async authenticate(username: string, password: string): Promise<ERPAuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple test logic: "admin" or "test" works
    if (username.toLowerCase() === 'admin' || username.toLowerCase() === 'test') {
      return { 
        success: true, 
        sessionId: 'mock_session_' + Math.random().toString(36).substring(7) 
      };
    }

    return { 
      success: false, 
      message: 'Invalid credentials Pulse. Please verify your QID and Password.' 
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
      photoUrl: 'https://picsum.photos/seed/keshav/200'
    };
  }

  async getAttendance(sessionId: string): Promise<AttendanceRecord[]> {
    return [
      {
        subjectName: 'Machine Learning',
        subjectCode: 'CS301',
        totalLectures: 40,
        present: 36,
        absent: 4,
        leave: 0,
        percentage: 90,
        status: 'Excellent'
      },
      {
        subjectName: 'Computer Networks',
        subjectCode: 'CS302',
        totalLectures: 38,
        present: 28,
        absent: 8,
        leave: 2,
        percentage: 73,
        status: 'Warning'
      }
    ];
  }

  async logout(sessionId: string): Promise<void> {
    // Clean up mock session logic here
    return Promise.resolve();
  }
}
