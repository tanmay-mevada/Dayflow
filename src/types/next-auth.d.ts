import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
      employeeId?: string;
      loginId?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    role: string;
    employeeId?: string;
    loginId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    employeeId?: string;
    loginId?: string;
  }
}

