
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';

export async function POST(req: NextRequest) {
  try {
    const { username, password, captcha, token } = await req.json();
    const sessionId = req.cookies.get('qums_temp_session')?.value;

    // Detailed safe diagnostics for session correlation
    console.log(`[API-LOGIN] Correlation Check - Session Cookie present: ${!!sessionId}, CSRF Token present: ${!!token}, Username: ${!!username}`);

    if (!sessionId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication session not found. Please refresh CAPTCHA.' 
      }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        message: 'Security token missing. Please refresh CAPTCHA.' 
      }, { status: 400 });
    }

    const erp = getERPProvider();
    const result = await erp.authenticate(username, password, captcha, token, sessionId);

    if (result.success) {
      const response = NextResponse.json({ success: true });

      // Establish authenticated session
      response.cookies.set('erp_session', result.sessionId!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 2, // 2 hours
        path: '/',
      });

      // Clear temporary session
      response.cookies.delete('qums_temp_session');

      return response;
    }

    return NextResponse.json({ 
      success: false, 
      message: result.message || 'Login failed. Please verify credentials and CAPTCHA.' 
    }, { status: 401 });
  } catch (error) {
    console.log('[API-LOGIN-ERROR]', error);
    return NextResponse.json({ success: false, message: 'System error during authentication pulse.' }, { status: 500 });
  }
}
