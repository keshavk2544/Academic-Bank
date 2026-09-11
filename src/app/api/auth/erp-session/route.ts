
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { getSessionStore } from '@/services/session-store';

export async function GET(req: NextRequest) {
  const appSessionId = req.cookies.get('erp_session')?.value;

  if (!appSessionId) {
    console.log('[SESSION] No erp_session cookie found in request.');
    return NextResponse.json({ authenticated: false, reason: 'no_cookie' }, { status: 401 });
  }

  try {
    const store = getSessionStore();
    const sessionData = await store.getSession(appSessionId);

    if (!sessionData) {
      console.warn(`[SESSION] Session ID ${appSessionId.substring(0, 8)} not found in store.`);
      return NextResponse.json({ 
        authenticated: false, 
        message: 'Your session has expired or the server was restarted.',
        reason: 'session_not_found'
      }, { status: 401 });
    }

    const { qumsCookies, expiresAt } = sessionData;

    // Check expiration
    if (new Date() > new Date(expiresAt)) {
      console.log(`[SESSION] Session ${appSessionId.substring(0, 8)} expired.`);
      await store.deleteSession(appSessionId).catch(() => {});
      return NextResponse.json({ authenticated: false, reason: 'expired' }, { status: 401 });
    }

    const erp = getERPProvider();
    
    try {
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
    } catch (profileError: any) {
      console.error('[SESSION] Failed to fetch student profile from QUMS:', profileError.message);
      // If the university specifically returns a 401/Unauthorized, the session is dead
      return NextResponse.json({ 
        authenticated: false, 
        message: 'University session expired.',
        reason: 'qums_unauthorized'
      }, { status: 401 });
    }

  } catch (error: any) {
    console.error('[SESSION-ERROR]', error.message);
    return NextResponse.json({ 
      authenticated: false, 
      message: 'Unable to reach university pulse.',
      reason: 'system_error'
    }, { status: 500 });
  }
}
