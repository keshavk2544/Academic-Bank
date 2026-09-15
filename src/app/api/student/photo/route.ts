
import { NextRequest } from 'next/server';
import { getSessionStore } from '@/services/session-store';
import { getERPProvider } from '@/services/erp';

/**
 * Endpoint to securely fetch the student profile photo as a binary stream.
 * Communicates with the university ERP using the student's authenticated session.
 * 
 * CRITICAL: This endpoint is strictly isolated by the 'erp_session_v2' cookie.
 * It NEVER uses global state or shared caches.
 */
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
    const photoResult = await erp.getStudentPhoto(sessionData.qumsCookies);

    // [PHOTO-SESSION-CHECK] - Diagnostic for user isolation audit
    console.log('[PHOTO-SESSION-CHECK]', {
      hasSessionCookie: !!appSessionId,
      hasSession: !!sessionData,
      hasQumsCookies: !!sessionData?.qumsCookies,
      photoExists: !!photoResult,
      photoLength: photoResult?.buffer.length || 0,
      safeSessionId: appSessionId.substring(0, 8) + '...'
    });

    if (!photoResult) {
      return new Response(null, { status: 404 });
    }

    return new Response(photoResult.buffer, {
      status: 200,
      headers: {
        'Content-Type': photoResult.contentType,
        // CRITICAL: Disable all caching to prevent cross-user photo leakage on shared browsers
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('[API-STUDENT-PHOTO-ERROR]', error);
    return new Response(null, { status: 500 });
  }
}
