
import { NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { getAdminFirestore, getAdminApp } from '@/lib/firebase-admin';

export async function GET() {
  console.log('[CAPTCHA] Initialization pulse started...');
  
  let adminInit = 'IDLE';
  let adminProjectId = 'unknown';
  let diagnosticStatus = 'PENDING';
  let diagnosticError = null;

  try {
    const app = getAdminApp();
    adminInit = 'SUCCESS';
    adminProjectId = app.options.projectId || 'detected';
    
    // Step 1: Server-side Firestore Admin Diagnostic (Privileged)
    const db = getAdminFirestore();
    const diagRef = db.collection('_adminDiagnostics').doc('connectivity-test');
    
    try {
      // Test Write
      await diagRef.set({
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      });
      
      // Test Read
      const snap = await diagRef.get();
      if (!snap.exists) throw new Error('Diagnostic document not found after write.');
      
      // Test Delete
      await diagRef.delete();
      
      diagnosticStatus = 'SUCCESS';
      console.log('[CAPTCHA] Firestore Admin Diagnostic: SUCCESS');
    } catch (dbError: any) {
      diagnosticStatus = 'FAILURE';
      diagnosticError = {
        code: dbError.code,
        message: dbError.message,
        details: dbError.details || 'No extra details'
      };
      console.error('[CAPTCHA] Firestore Admin Diagnostic: FAILURE', dbError);
    }

    // Only proceed to QUMS if Firestore Admin is functional
    if (diagnosticStatus !== 'SUCCESS') {
      return NextResponse.json({
        success: false,
        message: 'Storage failure: Server credentials cannot access Firestore.',
        debug: {
          adminInit,
          projectId: adminProjectId,
          diagnosticStatus,
          error: diagnosticError
        }
      }, { status: 500 });
    }

    // Step 2: QUMS CAPTCHA Retrieval (Preserving working logic)
    const erp = getERPProvider();
    const sessionData = await erp.initializeSession();

    if (!sessionData || !sessionData.captchaDataUri) {
      return NextResponse.json({ 
        success: false, 
        message: 'QUMS connection established but CAPTCHA source not found.' 
      }, { status: 502 });
    }

    const { sessionId: qumsCookies, token, captchaDataUri } = sessionData;
    const transactionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Step 3: Store QUMS session in Firestore using Admin SDK
    const transactionRef = db.collection('loginTransactions').doc(transactionId);
    await transactionRef.set({
      cookies: qumsCookies,
      token: token,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    });

    console.log(`[CAPTCHA] Transaction created: ${transactionId.substring(0, 8)}`);

    return NextResponse.json({ 
      success: true, 
      captcha: captchaDataUri,
      transactionId: transactionId
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });

  } catch (error: any) {
    console.error('[CAPTCHA] Unexpected error during pulse:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Unable to reach QUMS server pulse.',
      debug: {
        adminInit,
        projectId: adminProjectId,
        diagnosticStatus,
        error: error.message
      }
    }, { status: 503 });
  }
}
