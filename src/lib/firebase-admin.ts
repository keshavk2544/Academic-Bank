
import { initializeApp, getApps, App, getApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { firebaseConfig } from '@/firebase/config';

/**
 * Initializes the Firebase Admin SDK for privileged server-side access.
 * This instance bypasses Firestore Security Rules and must never be exposed to the client.
 */
export function getAdminApp(): App {
  if (getApps().length === 0) {
    try {
      // 1. Try initializing with Application Default Credentials (ADC)
      // This is the preferred method for App Hosting / Google Cloud.
      console.log('[FIREBASE-ADMIN] Attempting initialization with ADC...');
      return initializeApp();
    } catch (e: any) {
      console.warn('[FIREBASE-ADMIN] ADC initialization failed, trying explicit Project ID fallback.');
      
      // 2. Fallback: Use the Project ID from the app config or environment
      const projectId = process.env.GOOGLE_CLOUD_PROJECT || 
                        process.env.FIREBASE_PROJECT_ID || 
                        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
                        firebaseConfig.projectId;
      
      if (projectId) {
        console.log(`[FIREBASE-ADMIN] Initializing with explicit Project ID: ${projectId}`);
        return initializeApp({ projectId });
      }
      
      throw new Error(`Firebase Admin initialization failed. No credentials or Project ID found. Error: ${e.message}`);
    }
  }
  return getApp();
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}
