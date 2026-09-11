
import { NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { getAdminFirestore, getAdminApp } from '@/lib/firebase-admin';

export async function GET() {
  console.log('[CAPTCHA] Initialization started...');
  let adminInit = 'FAILURE';
  let adminProjectId = 'unknown';

  try {
    const app = getAdminApp();
    adminInit = 'SUCCESS';
    adminProjectId = app.options.projectId || 'detected';
  } catch (e) {
    console.error('[CAPTCHA] Admin initialization diagnostic:', e);
  }
  
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
    const cookieCount = qumsCookies.split(';').length;
    
    console.log(`[CAPTCHA] QUMS landing status: 200`);
    console.log(`[CAPTCHA] Admin project ID: ${adminProjectId}`);
    console.log(`[CAPTCHA] QUMS cookies captured: ${cookieCount}`);
    console.log(`[CAPTCHA] CSRF token found: ${token ? 'YES' : 'NO'}`);
    console.log(`[CAPTCHA] #imgPhoto found: YES`);

    // Create an opaque transaction ID for the browser
    const transactionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Attempt Admin Firestore write (privileged)
    try {
      const db = getAdminFirestore();
      const transactionRef = db.collection('loginTransactions').doc(transactionId);
      
      await transactionRef.set({
        cookies: qumsCookies,
        token: token,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      });
      
      console.log(`[CAPTCHA] loginTransactions Admin write: SUCCESS. ID: ${transactionId.substring(0, 8)}`);
    } catch (firestoreError: any) {
      console.error('[CAPTCHA] loginTransactions Admin write: FAILURE', {
        code: firestoreError.code,
        message: firestoreError.message
      });
      
      return NextResponse.json({ 
        success: false, 
        message: `Storage failure: ${firestoreError.message || 'Admin Firestore write failed.'}`,
        debug: {
          code: firestoreError.code,
          adminInit,
          projectId: adminProjectId
        }
      }, { status: 500 });
    }

    console.log('[CAPTCHA] API response: SUCCESS');
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
