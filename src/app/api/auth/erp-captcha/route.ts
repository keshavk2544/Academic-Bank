import { NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { initializeFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function GET() {
  console.log('[CAPTCHA] Initialization started...');
  
  try {
    const erp = getERPProvider();
    const sessionData = await erp.initializeSession();

    if (!sessionData || !sessionData.captchaDataUri) {
      console.error('[CAPTCHA] QUMS landing page returned but CAPTCHA source not found.');
      return NextResponse.json({ 
        success: false, 
        message: 'CAPTCHA source (#imgPhoto) not found on QUMS page.' 
      }, { status: 502 });
    }

    const { sessionId: qumsCookies, token, captchaDataUri } = sessionData;
    
    console.log(`[CAPTCHA] QUMS landing status: 200`);
    console.log(`[CAPTCHA] Captcha found. Type: ${captchaDataUri.startsWith('data:image') ? 'Data URI' : 'Binary/External'}`);
    console.log(`[CAPTCHA] Captcha bytes/length: ${captchaDataUri.length}`);

    // Create an opaque transaction ID for the browser
    const transactionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Attempt Firestore write
    try {
      const { firestore } = initializeFirebase();
      console.log('[CAPTCHA] Firestore initialized. Attempting transaction write...');
      
      const transactionRef = doc(firestore, 'loginTransactions', transactionId);
      
      await setDoc(transactionRef, {
        cookies: qumsCookies,
        token: token,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      });
      
      console.log(`[CAPTCHA] Firestore transaction write: SUCCESS. ID: ${transactionId.substring(0, 8)}`);
    } catch (firestoreError: any) {
      console.error('[CAPTCHA] Firestore transaction write: FAILURE', firestoreError);
      
      // If Firestore fails, we still return the CAPTCHA in development so we can see it,
      // but we warn the user that login will likely fail without session persistence.
      return NextResponse.json({ 
        success: false, 
        message: 'Storage failure: Firestore is not enabled or accessible.',
        captcha: captchaDataUri, // Include CAPTCHA anyway for visual debug
        debug: firestoreError.message
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      captcha: captchaDataUri,
      transactionId: transactionId
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error: any) {
    console.error('[CAPTCHA] Unexpected error during QUMS pulse:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Unable to reach QUMS server pulse.',
      error: error.message 
    }, { status: 503 });
  }
}
