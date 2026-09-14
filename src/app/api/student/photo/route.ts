
import { NextRequest } from 'next/server';
import { getSessionStore } from '@/services/session-store';
import { getERPProvider } from '@/services/erp';

/**
 * Endpoint to securely fetch the student profile photo as a binary stream.
 * Communicates with the university ERP using the student's authenticated session.
 */
export async function GET(req: NextRequest) {
  // 1. Read the existing erp_session_v2 cookie.
  const appSessionId = req.cookies.get('erp_session_v2')?.value;

  if (!appSessionId) {
    return new Response(null, { status: 401 });
  }

  try {
    // 2. Retrieve the server-side session.
    const store = getSessionStore();
    const sessionData = await store.getSession(appSessionId);

    if (!sessionData || !sessionData.qumsCookies) {
      return new Response(null, { status: 401 });
    }

    // 3. Retrieve the server-side QUMS cookies from that session and fetch the photo.
    const erp = getERPProvider();
    const photoResult = await erp.getStudentPhoto(sessionData.qumsCookies);

    if (!photoResult) {
      return new Response(null, { status: 404 });
    }

    // 4. Return the decoded bytes as an actual HTTP image response.
    return new Response(photoResult.buffer, {
      status: 200,
      headers: {
        'Content-Type': photoResult.contentType,
        'Cache-Control': 'private, max-age=300',
      },
    });
  } catch (error) {
    console.error('[API-STUDENT-PHOTO-ERROR]', error);
    return new Response(null, { status: 500 });
  }
}
