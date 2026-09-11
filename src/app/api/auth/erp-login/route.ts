
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

    // Retrieve the QUMS pre-login session from Admin Firestore
    const db = getAdminFirestore();
    const transactionRef = db.collection('loginTransactions').doc(transactionId);
    let transactionSnap;
    
    try {
      transactionSnap = await transactionRef.get();
    } catch (readError: any) {
      console.error('[ERP-LOGIN] Admin Firestore read: FAILURE', readError.code);
      return NextResponse.json({ 
        success: false, 
        message: 'Storage failure: Unable to retrieve authentication session.' 
      }, { status: 500 });
    }

    if (!transactionSnap.exists) {
      return NextResponse.json({ success: false, message: 'Authentication session not found. Please refresh.' }, { status: 401 });
    }

    const transactionData = transactionSnap.data();
    if (!transactionData) return NextResponse.json({ success: false, message: 'Data corruption.' }, { status: 500 });
    
    const { cookies: qumsCookies, token, expiresAt } = transactionData;

    // Check expiration
    if (new Date() > new Date(expiresAt)) {
      await transactionRef.delete().catch(() => {});
      return NextResponse.json({ success: false, message: 'Authentication session expired.' }, { status: 401 });
    }

    const erp = getERPProvider();
    const result = await erp.authenticate(username, password, captcha, token, qumsCookies);

    // Cleanup the pre-login transaction
    await transactionRef.delete().catch(() => {});

    if (result.success && result.sessionId) {
      console.log(`[ERP-LOGIN] QUMS login: SUCCESS for student: ${username}`);
      
      // Create a random opaque application session ID
      const appSessionId = randomUUID();
      const expires = new Date(Date.now() + 60 * 60 * 2 * 1000); // 2 hours
      
      // Store the authenticated QUMS cookies in Admin Firestore
      const sessionRef = db.collection('erpSessions').doc(appSessionId);
      await sessionRef.set({
        qumsCookies: result.sessionId,
        createdAt: new Date().toISOString(),
        expiresAt: expires.toISOString()
      });

      console.log(`[ERP-LOGIN] Server session created: SUCCESS. ID: ${appSessionId.substring(0, 8)}`);

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

    console.warn(`[ERP-LOGIN] QUMS login: FAILURE: ${result.message}`);
    return NextResponse.json({ 
      success: false, 
      message: result.message || 'Login failed.' 
    }, { status: 401 });
  } catch (error) {
    console.error('[API-LOGIN-ERROR]', error);
    return NextResponse.json({ success: false, message: 'System error during authentication.' }, { status: 500 });
  }
}
