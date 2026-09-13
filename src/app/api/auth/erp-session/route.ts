
import { NextRequest, NextResponse } from 'next/server';
import { getSessionStore } from '@/services/session-store';

export async function GET(req: NextRequest) {
  const appSessionId = req.cookies.get('erp_session')?.value;

  if (!appSessionId) {
    return NextResponse.json({ authenticated: false, reason: 'no_cookie' }, { 
      status: 401,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
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
      }, { 
        status: 401,
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }

    const { expiresAt, student } = sessionData;

    // Check PreRP session expiration
    if (new Date() > new Date(expiresAt)) {
      console.log(`[SESSION] PreRP session ${appSessionId.substring(0, 8)} expired.`);
      await store.deleteSession(appSessionId).catch(() => {});
      return NextResponse.json({ authenticated: false, reason: 'expired' }, { 
        status: 401,
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }

    // Return cached student identity without calling QUMS
    return NextResponse.json({
      authenticated: true,
      student
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });

  } catch (error: any) {
    console.error('[SESSION-ERROR]', error.message);
    return NextResponse.json({ 
      authenticated: false, 
      message: 'System error while verifying session.',
      reason: 'system_error'
    }, { 
      status: 500,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  }
}
