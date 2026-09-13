
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { getSessionStore } from '@/services/session-store';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { username, password, captcha, transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json({ success: false, message: 'Invalid request signature.' }, { status: 400 });
    }

    const store = getSessionStore();
    const transactionData = await store.getTransaction(transactionId);

    if (!transactionData) {
      return NextResponse.json({ success: false, message: 'Authentication session not found. Please refresh the page.' }, { status: 401 });
    }

    const { cookies: qumsCookies, token, expiresAt } = transactionData;

    if (new Date() > new Date(expiresAt)) {
      await store.deleteTransaction(transactionId);
      return NextResponse.json({ success: false, message: 'Authentication session expired.' }, { status: 401 });
    }

    const erp = getERPProvider();
    const result = await erp.authenticate(username, password, captcha, token, qumsCookies);

    // Cleanup the pre-login transaction
    await store.deleteTransaction(transactionId);

    if (result.success && result.sessionId) {
      // SYNC ERP DATA ONCE: Fetch the complete student profile
      console.log(`[LOGIN] Syncing ERP profile for ${username}...`);
      const profile = await erp.getStudentProfile(result.sessionId);

      const appSessionId = randomUUID();
      const expires = new Date(Date.now() + 60 * 60 * 24 * 1000); // 24 hours
      
      console.log(`[LOGIN] Creating secure session ${appSessionId.substring(0, 8)} with cached ERP profile.`);

      // Store authenticated session with FULL profile
      await store.saveSession(appSessionId, {
        qumsCookies: result.sessionId,
        student: profile,
        createdAt: new Date().toISOString(),
        expiresAt: expires.toISOString()
      });

      const response = NextResponse.json({ success: true });

      // Optimized cookie for desktop browser compatibility in Studio Preview
      response.cookies.set('erp_session', appSessionId, {
        httpOnly: true,
        secure: true, 
        sameSite: 'none',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ 
      success: false, 
      message: result.message || 'Login failed.' 
    }, { status: 401 });
  } catch (error) {
    console.error('[ERP-LOGIN-ERROR]', error);
    return NextResponse.json({ success: false, message: 'System error during authentication.' }, { status: 500 });
  }
}
