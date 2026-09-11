
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { getSessionStore } from '@/services/session-store';

export async function GET(req: NextRequest) {
  const appSessionId = req.cookies.get('erp_session')?.value;

  if (!appSessionId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const store = getSessionStore();
    const sessionData = await store.getSession(appSessionId);

    if (!sessionData) {
      return NextResponse.json({ authenticated: false, message: 'Session not found' }, { status: 401 });
    }

    const { qumsCookies, expiresAt } = sessionData;

    // Check expiration
    if (new Date() > new Date(expiresAt)) {
      return NextResponse.json({ authenticated: false, message: 'Session expired' }, { status: 401 });
    }

    const erp = getERPProvider();
    const profile = await erp.getStudentProfile(qumsCookies);

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
    console.error('[SESSION-ERROR]', error);
    const response = NextResponse.json({ authenticated: false, message: 'QUMS session expired or unreachable' }, { status: 401 });
    // Don't delete cookie on transient network failure, let the user retry
    return response;
  }
}
