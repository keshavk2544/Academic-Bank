
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { getSessionStore } from '@/services/session-store';

export async function POST(req: NextRequest) {
  const appSessionId = req.cookies.get('erp_session_v2')?.value;
  
  const response = NextResponse.json({ success: true });
  response.cookies.delete('erp_session_v2');

  if (appSessionId) {
    try {
      const store = getSessionStore();
      const sessionData = await store.getSession(appSessionId);

      if (sessionData) {
        const { qumsCookies } = sessionData;
        const erp = getERPProvider();
        
        // Clean up university side
        await erp.logout(qumsCookies).catch(() => {});
        
        // Clean up session store
        await store.deleteSession(appSessionId).catch(() => {});
        console.log(`[LOGOUT] Session ${appSessionId.substring(0, 4)} purged.`);
      }
    } catch (e) {
      console.error('[LOGOUT-ERROR]', e);
    }
  }

  return response;
}
