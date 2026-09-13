
import { NextRequest, NextResponse } from 'next/server';
import { getSessionStore } from '@/services/session-store';

/**
 * Returns the cached ERP student profile from the PreRP session.
 * NEVER contacts QUMS.
 */
export async function GET(req: NextRequest) {
  const appSessionId = req.cookies.get('erp_session')?.value;

  if (!appSessionId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const store = getSessionStore();
    const sessionData = await store.getSession(appSessionId);

    if (!sessionData) {
      return NextResponse.json({ success: false, message: 'Session expired' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      student: sessionData.student
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
