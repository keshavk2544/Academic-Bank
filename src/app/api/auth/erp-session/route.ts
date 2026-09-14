
import { NextRequest, NextResponse } from 'next/server';
import { getSessionStore } from '@/services/session-store';

export async function GET(req: NextRequest) {
  const appSessionId = req.cookies.get('erp_session')?.value;

  try {
    const store = getSessionStore();
    let sessionData = null;
    if (appSessionId) {
      sessionData = await store.getSession(appSessionId);
    }

    // SAFE DIAGNOSTICS
    console.log('[SESSION API CHECK]', {
      hasCookie: !!appSessionId,
      hasSession: !!sessionData,
      hasStudent: !!sessionData?.student,
      studentFields: sessionData?.student ? Object.keys(sessionData.student) : []
    });

    if (!appSessionId || !sessionData) {
      return NextResponse.json({ authenticated: false, reason: 'no_session' }, { 
        status: 401,
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }

    const { expiresAt, student } = sessionData;

    if (new Date() > new Date(expiresAt)) {
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
      message: 'System error',
      reason: 'system_error'
    }, { 
      status: 500,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  }
}
