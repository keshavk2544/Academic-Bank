
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';

export async function POST(req: NextRequest) {
  try {
    const { username, password, captcha, token } = await req.json();
    const sessionId = req.cookies.get('qums_temp_session')?.value;

    // Log the presence (not values) of required items for debugging
    console.log(`[API-LOGIN] SessionId present: ${!!sessionId}, Token present: ${!!token}, Username present: ${!!username}`);

    if (!sessionId || !token) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication session expired. Please refresh the CAPTCHA.' 
      }, { status: 400 });
    }

    const erp = getERPProvider();
    const result = await erp.authenticate(username, password, captcha, token, sessionId);

    if (result.success) {
      const response = NextResponse.json({ success: true });

      // Upgrade to authenticated session cookie
      response.cookies.set('erp_session', result.sessionId!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 2, // 2 hours
        path: '/',
      });

      // Clear the temp session
      response.cookies.delete('qums_temp_session');

      return response;
    }

    return NextResponse.json({ 
      success: false, 
      message: result.message || 'Invalid credentials or CAPTCHA.' 
    }, { status: 401 });
  } catch (error) {
    console.log('[API-LOGIN-ERROR]', error);
    return NextResponse.json({ success: false, message: 'System Error. Please try again later.' }, { status: 500 });
  }
}
