
import { initializeApp, getApps, App, getApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

/**
 * Initializes the Firebase Admin SDK for privileged server-side access.
 * This instance bypasses Firestore Security Rules and must never be exposed to the client.
 */
export function getAdminApp(): App {
  if (getApps().length === 0) {
    try {
      // Automatically uses environment-provided Application Default Credentials
      // or FIREBASE_CONFIG environment variable if present.
      console.log('[FIREBASE-ADMIN] Attempting default initialization...');
      return initializeApp();
    } catch (e: any) {
      console.error('[FIREBASE-ADMIN] Default initialization failed:', e.message);
      
      // Fallback: Check for project ID in environment if ADC initialization fails
      const projectId = process.env.GOOGLE_CLOUD_PROJECT || 
                        process.env.FIREBASE_PROJECT_ID || 
                        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      
      if (projectId) {
        console.log(`[FIREBASE-ADMIN] Retrying with explicit Project ID: ${projectId}`);
        return initializeApp({ projectId });
      }
      
      throw new Error(`Firebase Admin initialization failed. No credentials or Project ID found. Original error: ${e.message}`);
    }
  }
  return getApp();
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}
