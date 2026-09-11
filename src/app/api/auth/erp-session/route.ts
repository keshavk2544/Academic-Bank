
import { NextRequest, NextResponse } from 'next/server';
import { getERPProvider } from '@/services/erp';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  const appSessionId = req.cookies.get('erp_session')?.value;

  if (!appSessionId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const { firestore } = initializeFirebase();
    const sessionRef = doc(firestore, 'erpSessions', appSessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      console.warn(`[SESSION] App session ${appSessionId.substring(0, 4)} not found in store.`);
      return NextResponse.json({ authenticated: false, message: 'Session not found' }, { status: 401 });
    }

    const { qumsCookies, expiresAt } = sessionSnap.data();

    // Check expiration
    if (new Date() > new Date(expiresAt)) {
      console.warn(`[SESSION] App session ${appSessionId.substring(0, 4)} expired.`);
      return NextResponse.json({ authenticated: false, message: 'Session expired' }, { status: 401 });
    }

    const erp = getERPProvider();
    const profile = await erp.getStudentProfile(qumsCookies);

    console.log(`[SESSION] Active session for: ${profile.name}`);

    // Return ONLY the 4 required fields as requested
    return NextResponse.json({
      authenticated: true,
      student: {
        name: profile.name,
        qid: profile.enrollmentNo,
        course: profile.course,
        section: profile.section
      }
    });
  } catch (error) {
    console.error('[SESSION-ERROR]', error);
    const response = NextResponse.json({ authenticated: false, message: 'QUMS session expired or unreachable' }, { status: 401 });
    response.cookies.delete('erp_session');
    return response;
  }
}
