
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const { username, password, captcha, transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json({ success: false, message: 'Invalid request signature.' }, { status: 400 });
    }

    // Retrieve the QUMS session from Firestore
    const { firestore } = initializeFirebase();
    const transactionRef = doc(firestore, 'loginTransactions', transactionId);
    const transactionSnap = await getDoc(transactionRef);

    if (!transactionSnap.exists()) {
      console.warn(`[ERP-LOGIN] Transaction ${transactionId.substring(0, 4)} not found`);
      return NextResponse.json({ success: false, message: 'Authentication session not found. Please refresh.' }, { status: 401 });
    }

    const { cookies: qumsCookies, token, expiresAt } = transactionSnap.data();

    // Check expiration
    if (new Date() > new Date(expiresAt)) {
      console.warn(`[ERP-LOGIN] Transaction ${transactionId.substring(0, 4)} expired`);
      await deleteDoc(transactionRef);
      return NextResponse.json({ success: false, message: 'Authentication session expired.' }, { status: 401 });
    }

    const erp = getERPProvider();
    const result = await erp.authenticate(username, password, captcha, token, qumsCookies);

    // Cleanup the transaction after ONE attempt (Security)
    await deleteDoc(transactionRef);

    if (result.success) {
      console.log(`[ERP-LOGIN] Success for ${username}`);
      const response = NextResponse.json({ success: true });

      // Opaque app session (HttpOnly)
      response.cookies.set('erp_session', result.sessionId!, {
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
