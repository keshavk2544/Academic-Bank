
import { NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';

export async function GET() {
  try {
    const erp = getERPProvider();
    const { sessionId, token, captchaDataUri } = await erp.initializeSession();

    const response = NextResponse.json({ 
      success: true, 
      captcha: captchaDataUri,
      token: token
    });

    // Store the raw QUMS session state in a secure temp cookie
    // Path MUST be root to ensure visibility to /api/auth/erp-login
    response.cookies.set('qums_temp_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 mins
      path: '/',
    });

    console.log(`[API-CAPTCHA] Session initialized successfully. Cookies captured.`);

    return response;
  } catch (error) {
    console.log('[API-CAPTCHA-ERROR]', error);
    return NextResponse.json({ success: false, message: 'ERP Pulse Unavailable' }, { status: 503 });
  }
}
