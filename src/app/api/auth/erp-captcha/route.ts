
import { NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { initializeFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const erp = getERPProvider();
    const { sessionId: qumsCookies, token, captchaDataUri } = await erp.initializeSession();

    // Create an opaque transaction ID
    const transactionId = Math.random().toString(36).substring(2, 15);
    
    // Store QUMS session state in Firestore
    const { firestore } = initializeFirebase();
    const transactionRef = doc(firestore, 'loginTransactions', transactionId);
    
    await setDoc(transactionRef, {
      cookies: qumsCookies,
      token: token,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 mins
    });

    return NextResponse.json({ 
      success: true, 
      captcha: captchaDataUri,
      transactionId: transactionId
    });
  } catch (error) {
    console.error('[API-CAPTCHA-ERROR]', error);
    return NextResponse.json({ success: false, message: 'ERP Pulse Unavailable' }, { status: 503 });
  }
}
