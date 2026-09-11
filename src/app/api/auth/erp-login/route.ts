
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';

export async function POST(req: NextRequest) {
  try {
    const { username, password, captcha, token } = await req.json();
    const sessionId = req.cookies.get('qums_temp_session')?.value;

    if (!sessionId || !token) {
      return NextResponse.json({ message: 'Session expired, refresh captcha' }, { status: 400 });
    }

    const erp = getERPProvider();
    const result = await erp.authenticate(username, password, captcha, token, sessionId);

    if (result.success) {
      const response = NextResponse.json({ success: true });

      // Upgrade to authenticated session cookie
      response.cookies.set('erp_session', result.sessionId!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 2, // 2 hours
        path: '/',
      });

      // Clear the temp session
      response.cookies.delete('qums_temp_session');

      return response;
    }

    return NextResponse.json({ success: false, message: result.message }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Login Error' }, { status: 500 });
  }
}
