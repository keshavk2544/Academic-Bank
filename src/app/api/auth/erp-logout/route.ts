
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  const appSessionId = req.cookies.get('erp_session')?.value;
  
  const response = NextResponse.json({ success: true });
  response.cookies.delete('erp_session');

  if (appSessionId) {
    try {
      const { firestore } = initializeFirebase();
      const sessionRef = doc(firestore, 'erpSessions', appSessionId);
      const sessionSnap = await getDoc(sessionRef);

      if (sessionSnap.exists()) {
        const { qumsCookies } = sessionSnap.data();
        const erp = getERPProvider();
        
        // Clean up university side
        await erp.logout(qumsCookies).catch(() => {});
        
        // Clean up our side
        await deleteDoc(sessionRef).catch(() => {});
        console.log(`[LOGOUT] Session ${appSessionId.substring(0, 4)} purged.`);
      }
    } catch (e) {
      console.error('[LOGOUT-ERROR]', e);
    }
  }

  return response;
}
