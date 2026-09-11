
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { getAdminFirestore } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  const appSessionId = req.cookies.get('erp_session')?.value;
  
  const response = NextResponse.json({ success: true });
  response.cookies.delete('erp_session');

  if (appSessionId) {
    try {
      const db = getAdminFirestore();
      const sessionRef = db.collection('erpSessions').doc(appSessionId);
      const sessionSnap = await sessionRef.get();

      if (sessionSnap.exists) {
        const sessionData = sessionSnap.data();
        if (sessionData) {
          const { qumsCookies } = sessionData;
          const erp = getERPProvider();
          
          // Clean up university side
          await erp.logout(qumsCookies).catch(() => {});
          
          // Clean up Admin Firestore store
          await sessionRef.delete().catch(() => {});
          console.log(`[LOGOUT] Admin session ${appSessionId.substring(0, 4)} purged.`);
        }
      }
    } catch (e) {
      console.error('[LOGOUT-ERROR]', e);
    }
  }

  return response;
}
