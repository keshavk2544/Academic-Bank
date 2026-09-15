'use client';

import { useEffect, useState } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

/**
 * A central listener that catches Firestore permission errors emitted
 * throughout the app and re-throws them to be caught by the development
 * error overlay. This is critical for debugging Security Rules.
 */
export function FirebaseErrorListener() {
  const [, setError] = useState(null);

  useEffect(() => {
    errorEmitter.on('permission-error', (error) => {
      // Re-throwing inside a state setter is a React pattern to trigger 
      // the closest Error Boundary or the development overlay.
      setError(() => {
        throw error;
      });
    });
  }, []);

  return null;
}
