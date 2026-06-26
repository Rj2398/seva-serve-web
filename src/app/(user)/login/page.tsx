// app/login/page.tsx
import { globalServerRequest } from "@/actions/globalApi";
import ClientComponent from "./ClientComponent";
import { ServerActionResponse } from "@/types/auth";

export default async function LoginPage() {
  // Explicitly typed Server Action
  async function handleLogin(
    email: string,
    password: string
  ): Promise<ServerActionResponse> {
    "use server";

    try {
      const result = await globalServerRequest({
        endpoint: "login",
        method: "POST",
        payload: { email, password },
      });

      if (!result || !result.success) {
        return {
          success: false,
          error: result?.error || "Authentication failed.",
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (err) {
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <ClientComponent loginData={handleLogin} />
    </div>
  );
}
