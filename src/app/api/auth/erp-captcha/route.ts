
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
    // Phase 1: Admin SDK Diagnostic
    try {
      const app = getAdminApp();
      adminInit = 'SUCCESS';
      adminProjectId = app.options.projectId || 'detected-via-adc';
      
      const db = getAdminFirestore();
      const diagRef = db.collection('_adminDiagnostics').doc('connectivity-test');
      
      // Perform privileged write/read/delete test
      await diagRef.set({
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        runtime: 'app-hosting-check'
      });
      
      const snap = await diagRef.get();
      if (!snap.exists) throw new Error('Diagnostic write failed verification.');
      
      await diagRef.delete();
      diagnosticStatus = 'SUCCESS';
      console.log('[CAPTCHA] Firestore Admin Diagnostic: SUCCESS');
    } catch (dbError: any) {
      diagnosticStatus = 'FAILURE';
      diagnosticError = {
        code: dbError.code || 'unknown',
        message: dbError.message,
        isCredentialError: dbError.message.includes('METADATA') || dbError.message.includes('ACCESS_TOKEN')
      };
      console.error('[CAPTCHA] Firestore Admin Diagnostic: FAILURE', dbError);
    }

    // Only proceed to QUMS if Firestore Admin is functional (Production Requirement)
    if (diagnosticStatus !== 'SUCCESS') {
      return NextResponse.json({
        success: false,
        message: diagnosticError?.isCredentialError 
          ? 'Environment Error: Studio Preview lacks Google Credentials. Please test in App Hosting.'
          : 'Storage failure: Admin Firestore is not accessible.',
        debug: {
          adminInit,
          projectId: adminProjectId,
          diagnosticStatus,
          error: diagnosticError
        }
      }, { status: 500 });
    }

    // Phase 2: QUMS CAPTCHA Retrieval
    const erp = getERPProvider();
    const sessionData = await erp.initializeSession();

    if (!sessionData || !sessionData.captchaDataUri) {
      return NextResponse.json({ 
        success: false, 
        message: 'QUMS connection established but CAPTCHA source not found.' 
        // Note: No sensitive data logged
      }, { status: 502 });
    }

    const { sessionId: qumsCookies, token, captchaDataUri } = sessionData;
    const transactionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Store QUMS session in Firestore using privileged Admin SDK
    const db = getAdminFirestore();
    const transactionRef = db.collection('loginTransactions').doc(transactionId);
    await transactionRef.set({
      cookies: qumsCookies,
      token: token,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 min window
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
        diagnosticStatus,
        error: error.message
      }
    }, { status: 503 });
  }
}
