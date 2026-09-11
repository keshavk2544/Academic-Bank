
import { NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';

export async function GET() {
  try {
    const erp = getERPProvider();
    const { sessionId, token, captchaDataUri } = await erp.initializeSession();

    const response = NextResponse.json({ 
      success: true, 
      captcha: captchaDataUri,
      token: token // This is required for the login POST
    });

    // Store the initial QUMS session ID in a secure temp cookie
    response.cookies.set('qums_temp_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 600, // 10 mins for login flow
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: 'ERP Unavailable' }, { status: 503 });
  }
}
