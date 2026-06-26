export const dynamic = "force-dynamic";

import ClientComponent from "./ClientComponent";
import { globalServerRequest } from "@/actions/globalApi";

export default async function ServicePage() {

  const response = await globalServerRequest({
    endpoint: "services",
    method: "POST"
  });

  console.log("Server side dynamic API response:", response);

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        <ClientComponent serviceData={response?.data?.data} />
      </div>
    </>
  );
}