
import { NextRequest, NextResponse } from 'next/server';
import { getSessionStore } from '@/services/session-store';

export async function GET(req: NextRequest) {
  const appSessionId = req.cookies.get('erp_session')?.value;

  if (!appSessionId) {
    console.log('[SESSION-CHECK] No session cookie found.');
    return NextResponse.json({ authenticated: false, reason: 'no_cookie' }, { 
      status: 401,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  }

  try {
    const store = getSessionStore();
    const sessionData = await store.getSession(appSessionId);

    if (!sessionData) {
      console.log('[SESSION-CHECK] Session not found in store:', appSessionId.substring(0, 8));
      return NextResponse.json({ 
        authenticated: false, 
        message: 'Your session has expired.',
        reason: 'session_not_found'
      }, { 
        status: 401,
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }

    const { expiresAt, student } = sessionData;

    if (new Date() > new Date(expiresAt)) {
      console.log('[SESSION-CHECK] Session expired globally.');
      await store.deleteSession(appSessionId).catch(() => {});
      return NextResponse.json({ authenticated: false, reason: 'expired' }, { 
        status: 401,
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }

    // Return the cached profile. NEVER contacts QUMS.
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
