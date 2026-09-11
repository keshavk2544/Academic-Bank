
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { getAdminFirestore } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  const appSessionId = req.cookies.get('erp_session')?.value;

  if (!appSessionId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const db = getAdminFirestore();
    const sessionRef = db.collection('erpSessions').doc(appSessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      return NextResponse.json({ authenticated: false, message: 'Session not found' }, { status: 401 });
    }

    const sessionData = sessionSnap.data()!;
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
    response.cookies.delete('erp_session');
    return response;
  }
}
