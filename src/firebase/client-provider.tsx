
'use client';

import React, { useMemo } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/firebase-error-listener';

/**
 * Ensures Firebase is initialized exactly once on the client and
 * provides the instances to the rest of the application via the FirebaseProvider.
 * It also registers the global error listener for Firestore permission errors.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const { app, firestore, auth, storage } = useMemo(() => {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);
    return { app, firestore, auth, storage };
  }, []);

  return (
    <FirebaseProvider app={app} firestore={firestore} auth={auth} storage={storage}>
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
