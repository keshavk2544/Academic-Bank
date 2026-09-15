
'use client';

import { FirestorePermissionError } from './errors';

type ErrorListener = (error: FirestorePermissionError) => void;

class SimpleEmitter {
  private listeners: Record<string, ErrorListener[]> = {};

  on(event: 'permission-error', listener: ErrorListener) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(listener);
  }

  emit(event: 'permission-error', error: FirestorePermissionError) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(l => l(error));
    }
  }
}

export const errorEmitter = new SimpleEmitter();
