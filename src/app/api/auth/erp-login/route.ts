
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
      // 1. Fetch complete student profile ONCE
      const profile = await erp.getStudentProfile(result.sessionId);
      
      // SAFE DIAGNOSTIC LOGGING
      console.log('[ERP PROFILE CHECK]', {
        hasProfile: !!profile,
        fields: Object.keys(profile || {}),
        hasName: !!profile?.name,
        hasEnrollmentNo: !!profile?.enrollmentNo,
        hasSemester: !!profile?.semester,
        hasPhoto: !!profile?.photoUrl,
      });

      const appSessionId = randomUUID();
      const expires = new Date(Date.now() + 60 * 60 * 24 * 1000); // 24 hours
      
      const sessionData = {
        qumsCookies: result.sessionId,
        student: profile,
        createdAt: new Date().toISOString(),
        expiresAt: expires.toISOString()
      };

      // 2. Store authenticated session
      await store.saveSession(appSessionId, sessionData);

      // 3. Verification check
      const verification = await store.getSession(appSessionId);
      console.log('[SESSION PROFILE CHECK]', {
        exists: !!verification,
        hasStudent: !!verification?.student,
        fields: verification?.student ? Object.keys(verification.student) : []
      });

      const response = NextResponse.json({ success: true });

      // Environment-aware cookie settings
      const isProduction = process.env.NODE_ENV === 'production' && process.env.FIREBASE_CONFIG !== undefined;
      
      response.cookies.set('erp_session', appSessionId, {
        httpOnly: true,
        secure: isProduction, 
        sameSite: 'lax',
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
