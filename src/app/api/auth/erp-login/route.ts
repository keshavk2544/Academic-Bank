
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { crypto } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { username, password, captcha, transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json({ success: false, message: 'Invalid request signature.' }, { status: 400 });
    }

    // Retrieve the QUMS pre-login session from Firestore
    const { firestore } = initializeFirebase();
    const transactionRef = doc(firestore, 'loginTransactions', transactionId);
    let transactionSnap;
    
    try {
      transactionSnap = await getDoc(transactionRef);
    } catch (readError: any) {
      console.error('[ERP-LOGIN] Firestore transaction read: FAILURE', readError.code);
      return NextResponse.json({ 
        success: false, 
        message: 'Storage failure: Unable to retrieve authentication session.' 
      }, { status: 500 });
    }

    if (!transactionSnap.exists()) {
      return NextResponse.json({ success: false, message: 'Authentication session not found. Please refresh.' }, { status: 401 });
    }

    const { cookies: qumsCookies, token, expiresAt } = transactionSnap.data();

    // Check expiration
    if (new Date() > new Date(expiresAt)) {
      await deleteDoc(transactionRef).catch(() => {});
      return NextResponse.json({ success: false, message: 'Authentication session expired.' }, { status: 401 });
    }

    const erp = getERPProvider();
    const result = await erp.authenticate(username, password, captcha, token, qumsCookies);

    // Cleanup the pre-login transaction
    await deleteDoc(transactionRef).catch(() => {});

    if (result.success && result.sessionId) {
      console.log(`[ERP-LOGIN] Success for student: ${username}`);
      
      // Create a random opaque application session ID
      const appSessionId = crypto.randomUUID();
      const expires = new Date(Date.now() + 60 * 60 * 2000); // 2 hours
      
      // Store the authenticated QUMS cookies server-side
      const sessionRef = doc(firestore, 'erpSessions', appSessionId);
      await setDoc(sessionRef, {
        qumsCookies: result.sessionId,
        createdAt: new Date().toISOString(),
        expiresAt: expires.toISOString()
      });

      console.log(`[ERP-LOGIN] Server session created: ${appSessionId.substring(0, 8)}`);

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

    console.warn(`[ERP-LOGIN] Failed: ${result.message}`);
    return NextResponse.json({ 
      success: false, 
      message: result.message || 'Login failed.' 
    }, { status: 401 });
  } catch (error) {
    console.error('[API-LOGIN-ERROR]', error);
    return NextResponse.json({ success: false, message: 'System error during authentication.' }, { status: 500 });
  }
}
