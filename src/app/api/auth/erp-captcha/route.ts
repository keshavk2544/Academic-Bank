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
    console.log(`[CAPTCHA] Captcha found. Length: ${captchaDataUri.length}`);

    // Create an opaque transaction ID for the browser
    const transactionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Attempt Firestore write
    try {
      const { firestore, app } = initializeFirebase();
      const projectId = app.options.projectId;
      console.log(`[CAPTCHA] Firestore initializing for project: ${projectId}`);
      
      const transactionRef = doc(firestore, 'loginTransactions', transactionId);
      
      await setDoc(transactionRef, {
        cookies: qumsCookies,
        token: token,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      });
      
      console.log(`[CAPTCHA] Firestore transaction write: SUCCESS. ID: ${transactionId.substring(0, 8)}`);
    } catch (firestoreError: any) {
      // Safe diagnostics: Log the error code and message but no secrets
      console.error('[CAPTCHA] Firestore transaction write: FAILURE', {
        code: firestoreError.code,
        message: firestoreError.message
      });
      
      // Return the CAPTCHA anyway so the user can see it, but signal the storage failure
      return NextResponse.json({ 
        success: false, 
        message: 'Storage failure: Firestore permissions or configuration issue.',
        captcha: captchaDataUri,
        debug: {
          code: firestoreError.code,
          message: firestoreError.message
        }
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