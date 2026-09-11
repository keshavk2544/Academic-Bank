
import { NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { getSessionStore } from '@/services/session-store';

export async function GET() {
  console.log('[CAPTCHA] Pulse initialized...');
  
  try {
    const erp = getERPProvider();
    const sessionData = await erp.initializeSession();

    if (!sessionData || !sessionData.captchaDataUri) {
      return NextResponse.json({ 
        success: false, 
        message: 'QUMS reached but CAPTCHA source not found.' 
      }, { status: 502 });
    }

    const { sessionId: qumsCookies, token, captchaDataUri } = sessionData;
    
    // Create opaque transaction ID
    const transactionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Store QUMS session in the environment-aware store
    const store = getSessionStore();
    await store.saveTransaction(transactionId, {
      cookies: qumsCookies,
      token: token,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 min window
      createdAt: new Date().toISOString()
    });

    console.log(`[CAPTCHA] Transaction ${transactionId.substring(0, 8)} stored successfully.`);

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
    console.error('[CAPTCHA] Unexpected error during pulse:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Unable to reach QUMS server pulse.',
      debug: {
        error: error.message
      }
    }, { status: 503 });
  }
}
