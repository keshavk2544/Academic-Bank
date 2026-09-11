
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

    // Store the initial QUMS session ID in a secure temp cookie
    // Changed SameSite to 'lax' to ensure consistency across API routes
    response.cookies.set('qums_temp_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 mins
      path: '/',
    });

    return response;
  } catch (error) {
    console.log('[API-CAPTCHA-ERROR]', error);
    return NextResponse.json({ success: false, message: 'ERP Unavailable' }, { status: 503 });
  }
}
