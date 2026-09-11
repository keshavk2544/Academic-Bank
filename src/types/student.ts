/**
 * Clean internal representations of student-related data.
 */

export interface StudentProfile {
  uid: string;
  studentId: string;
  registrationId: string;
  enrollmentNo: string;
  name: string;
  course: string;
  branch: string;
  section: string;
  semester: number;
  photoUrl?: string;
}

export interface AttendanceRecord {
  subjectName: string;
  subjectCode: string;
  totalLectures: number;
  present: number;
  absent: number;
  leave: number;
  percentage: number;
  status: 'Critical' | 'Warning' | 'Good' | 'Excellent';
}
