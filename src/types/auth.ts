// types/auth.ts

export type LoginResponse = {
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
};

export type ServerActionResponse =
  | { success: true; data: LoginResponse; error?: never }
  | { success: false; error: string; data?: never };
