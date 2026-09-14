
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
    console.log('[PROFILE API CHECK]', {
      hasCookie: !!appSessionId,
      hasSession: !!sessionData,
      hasStudent: !!sessionData?.student,
      studentFields: sessionData?.student ? Object.keys(sessionData.student) : []
    });

    if (!appSessionId || !sessionData) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Return CACHED profile only.
    return NextResponse.json({
      success: true,
      student: sessionData.student
    });
  } catch (error) {
    console.error('[PROFILE-API-ERROR]', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
