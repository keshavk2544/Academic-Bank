
import { NextRequest, NextResponse } from 'next/server';
import { getSessionStore } from '@/services/session-store';
import { getERPProvider } from '@/services/erp';

/**
 * Manually refreshes the cached ERP profile by calling QUMS.
 */
export async function POST(req: NextRequest) {
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

    const { qumsCookies } = sessionData;
    const erp = getERPProvider();
    
    // Explicit call to QUMS to refresh data
    const profile = await erp.getStudentProfile(qumsCookies);

    // Update the cache
    const updatedSession = {
      ...sessionData,
      student: profile
    };

    await store.saveSession(appSessionId, updatedSession);

    return NextResponse.json({
      success: true,
      student: profile
    });
  } catch (error) {
    console.error('[ERP-SYNC-ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      message: 'ERP sync unavailable. Your existing profile is still available.' 
    }, { status: 503 });
  }
}
