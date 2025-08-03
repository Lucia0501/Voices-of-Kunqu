import * as React from 'react';
import { cn } from '@/lib/utils';

// Simple toast provider for now - we'll enhance this later with proper toast system
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}