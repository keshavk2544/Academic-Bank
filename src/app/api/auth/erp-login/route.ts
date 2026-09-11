import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';

/**
 * Secure server-side endpoint for ERP authentication.
 * Never logs or exposes the ERP password.
 */
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });
    }

    const erp = getERPProvider();
    const result = await erp.authenticate(username, password);

    if (result.success) {
      // Create a secure response
      const response = NextResponse.json({ 
        success: true, 
        message: 'Authentication successful' 
      });

      // Set the ERP session ID as a secure, HttpOnly cookie.
      // The browser can't read this, but it will send it back to our API.
      response.cookies.set('erp_session', result.sessionId!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 2, // 2 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: result.message || 'Login failed' },
      { status: 401 }
    );

  } catch (error) {
    // Redact sensitive details in logs
    console.error('[ERP_AUTH_API] Error during authentication');
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
