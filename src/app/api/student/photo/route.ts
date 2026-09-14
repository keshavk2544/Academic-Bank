
import { NextRequest } from 'next/server';
import { getSessionStore } from '@/services/session-store';
import { getERPProvider } from '@/services/erp';

export async function GET(req: NextRequest) {
  const appSessionId = req.cookies.get('erp_session_v2')?.value;

  if (!appSessionId) {
    return new Response(null, { status: 401 });
  }

  try {
    const store = getSessionStore();
    const sessionData = await store.getSession(appSessionId);

    if (!sessionData || !sessionData.qumsCookies) {
      return new Response(null, { status: 401 });
    }

    const erp = getERPProvider();
    const photoBuffer = await erp.getStudentPhoto(sessionData.qumsCookies);

    if (!photoBuffer) {
      return new Response(null, { status: 404 });
    }

    // Return pure binary Response to ensure browser treats it as an image
    return new Response(photoBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[PHOTO-API-ERROR]', error);
    return new Response(null, { status: 500 });
  }
}
