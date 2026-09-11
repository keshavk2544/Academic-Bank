
import { initializeApp, getApps, App, getApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

/**
 * Initializes the Firebase Admin SDK for privileged server-side access.
 * This instance bypasses Firestore Security Rules and must never be exposed to the client.
 */
export function getAdminApp(): App {
  if (getApps().length === 0) {
    // Automatically uses environment-provided Application Default Credentials
    // or FIREBASE_CONFIG environment variable if present.
    try {
      console.log('[FIREBASE-ADMIN] Attempting default initialization...');
      return initializeApp();
    } catch (e: any) {
      console.error('[FIREBASE-ADMIN] Default initialization failed:', e.message);
      // Fallback: check if we can at least detect the project ID from environment
      const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID;
      if (projectId) {
        console.log(`[FIREBASE-ADMIN] Retrying with explicit Project ID: ${projectId}`);
        return initializeApp({ projectId });
      }
      throw e;
    }
  }
  return getApp();
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}
