'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';

export function useSession() {
  const { data: session, status } = useNextAuthSession();
  
  return {
    user: session?.user,
    userId: session?.user?.id as string | undefined,
    role: session?.user?.role as string | undefined,
    employeeId: session?.user?.employeeId as string | undefined,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
  };
}

