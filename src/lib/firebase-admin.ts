
import { initializeApp, getApps, App, getApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

/**
 * Initializes the Firebase Admin SDK for privileged server-side access.
 * This instance bypasses Firestore Security Rules and must never be exposed to the client.
 */
export function getAdminApp(): App {
  if (getApps().length === 0) {
    // Automatically uses environment-provided Application Default Credentials
    return initializeApp();
  }
  return getApp();
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}
