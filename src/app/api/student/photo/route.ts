
import { NextRequest, NextResponse } from 'next/server';
import { getSessionStore } from '@/services/session-store';
import { getERPProvider } from '@/services/erp';

export async function GET(req: NextRequest) {
  const appSessionId = req.cookies.get('erp_session_v2')?.value;

  if (!appSessionId) {
    return new NextResponse(null, { status: 401 });
  }

  try {
    const store = getSessionStore();
    const sessionData = await store.getSession(appSessionId);

    if (!sessionData || !sessionData.qumsCookies) {
      return new NextResponse(null, { status: 401 });
    }

    const erp = getERPProvider();
    const photoBuffer = await erp.getStudentPhoto(sessionData.qumsCookies);

    if (!photoBuffer) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(photoBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[PHOTO-API-ERROR]', error);
    return new NextResponse(null, { status: 500 });
  }
}
