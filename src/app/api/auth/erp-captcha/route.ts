
import { NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { initializeFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const erp = getERPProvider();
    const { sessionId: qumsCookies, token, captchaDataUri } = await erp.initializeSession();

    // Create an opaque transaction ID for the browser
    const transactionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Store QUMS session state in Firestore (Expires in 10 mins)
    // NOTE: Requires Firestore enabled in Firebase Console
    try {
      const { firestore } = initializeFirebase();
      const transactionRef = doc(firestore, 'loginTransactions', transactionId);
      
      await setDoc(transactionRef, {
        cookies: qumsCookies,
        token: token,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      });
    } catch (firestoreError) {
      console.error('[API-CAPTCHA-FIRESTORE-ERROR]', firestoreError);
      return NextResponse.json({ 
        success: false, 
        message: 'Storage failure. Enable Firestore in Console.' 
      }, { status: 500 });
    }

    console.log(`[API-CAPTCHA] Transaction created: ${transactionId.substring(0, 8)}. Captcha Length: ${captchaDataUri.length}`);

    return NextResponse.json({ 
      success: true, 
      captcha: captchaDataUri,
      transactionId: transactionId
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error('[API-CAPTCHA-ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'ERP connection failed' 
    }, { status: 503 });
  }
}
