
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { getSessionStore } from '@/services/session-store';

export async function GET(req: NextRequest) {
  const appSessionId = req.cookies.get('erp_session')?.value;

  if (!appSessionId) {
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
      await store.deleteSession(appSessionId).catch(() => {});
      return NextResponse.json({ authenticated: false, reason: 'expired' }, { status: 401 });
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
  } catch (error: any) {
    console.error('[SESSION-ERROR]', error.message);
    
    // Check if it's a QUMS specific failure (invalid cookies)
    const isAuthError = error.message?.includes('failed') || error.message?.includes('401');
    
    return NextResponse.json({ 
      authenticated: false, 
      message: isAuthError ? 'University session expired.' : 'Unable to reach university pulse.',
      reason: 'qums_error'
    }, { status: 401 });
  }
}
