
import { NextRequest, NextResponse } from 'next/server';
import { getSessionStore } from '@/services/session-store';

export async function GET(req: NextRequest) {
  const appSessionId = req.cookies.get('erp_session_v2')?.value;

  try {
    const store = getSessionStore();
    let sessionData = null;
    if (appSessionId) {
      sessionData = await store.getSession(appSessionId);
    }

    // Step 7 Trace: Diagnostic for profile API
    if (sessionData && sessionData.student) {
      console.log('[STEP-7-PROFILE-API-RETRIEVAL]', {
        hasPhotoUrl: !!sessionData.student.photoUrl,
        photoUrlLength: sessionData.student.photoUrl?.length || 0,
        photoUrlStartsWithData: sessionData.student.photoUrl?.startsWith('data:') || false
      });
    }

    if (!appSessionId || !sessionData) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { 
        status: 401,
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }

    return NextResponse.json({
      success: true,
      student: sessionData.student
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error) {
    console.error('[PROFILE-API-ERROR]', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
