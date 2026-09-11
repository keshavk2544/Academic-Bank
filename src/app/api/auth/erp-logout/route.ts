
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get('erp_session')?.value;
  
  const response = NextResponse.json({ success: true });
  response.cookies.delete('erp_session');

  if (sessionId) {
    try {
      const erp = getERPProvider();
      await erp.logout(sessionId);
    } catch (e) {
      // Ignore logout errors
    }
  }

  return response;
}
