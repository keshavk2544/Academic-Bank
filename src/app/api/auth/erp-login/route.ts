
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { username, password, captcha, transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json({ success: false, message: 'Invalid request signature.' }, { status: 400 });
    }

    // Retrieve the QUMS pre-login session from Firestore using Admin SDK
    const db = getAdminFirestore();
    const transactionRef = db.collection('loginTransactions').doc(transactionId);
    const transactionSnap = await transactionRef.get();

    if (!transactionSnap.exists) {
      return NextResponse.json({ success: false, message: 'Authentication session not found. Please refresh.' }, { status: 401 });
    }

    const transactionData = transactionSnap.data()!;
    const { cookies: qumsCookies, token, expiresAt } = transactionData;

    // Check expiration
    if (new Date() > new Date(expiresAt)) {
      await transactionRef.delete();
      return NextResponse.json({ success: false, message: 'Authentication session expired.' }, { status: 401 });
    }

    const erp = getERPProvider();
    const result = await erp.authenticate(username, password, captcha, token, qumsCookies);

    // Cleanup the pre-login transaction
    await transactionRef.delete();

    if (result.success && result.sessionId) {
      // Create a random opaque application session ID
      const appSessionId = randomUUID();
      const expires = new Date(Date.now() + 60 * 60 * 2 * 1000); // 2 hours
      
      // Store the authenticated QUMS cookies in Firestore using Admin SDK
      const sessionRef = db.collection('erpSessions').doc(appSessionId);
      await sessionRef.set({
        qumsCookies: result.sessionId,
        createdAt: new Date().toISOString(),
        expiresAt: expires.toISOString()
      });

      const response = NextResponse.json({ success: true });

      // Opaque application session ID (HttpOnly)
      response.cookies.set('erp_session', appSessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 2, // 2 hours
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
