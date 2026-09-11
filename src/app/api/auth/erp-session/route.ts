
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get('erp_session')?.value;

  if (!sessionId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const erp = getERPProvider();
    const profile = await erp.getStudentProfile(sessionId);

    // Return ONLY the 4 required fields
    return NextResponse.json({
      authenticated: true,
      student: {
        name: profile.name,
        qid: profile.enrollmentNo,
        course: profile.course,
        section: profile.section
      }
    });
  } catch (error) {
    // Session likely expired at QUMS end
    const response = NextResponse.json({ authenticated: false, message: 'QUMS session expired' }, { status: 401 });
    response.cookies.delete('erp_session');
    return response;
  }
}
