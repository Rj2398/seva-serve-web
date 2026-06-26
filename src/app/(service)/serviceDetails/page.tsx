export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ServiceViewDetail from "./ServiceViewDetail";
import { globalServerRequest } from "@/actions/globalApi";

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
    serviceId?: string;
  }>;
}

async function ServicePageContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const categoryId = params.categoryId;
  const serviceId = params.serviceId;

  let initialServiceData = null;

  if (categoryId || serviceId) {
    try {
      // Try POST first
      let response = await globalServerRequest({
        endpoint: "services/getCategoryService",
        method: "POST",
        payload: {
          category_id: categoryId ? Number(categoryId) : undefined,
          service_id: serviceId ? Number(serviceId) : undefined,
          categoryId: categoryId ? Number(categoryId) : undefined,
          serviceId: serviceId ? Number(serviceId) : undefined,
        }
      });

      // Fallback to GET if POST was unsuccessful
      if (!response.success) {
        const queryParams = [];
        if (categoryId) queryParams.push(`category_id=${categoryId}&categoryId=${categoryId}`);
        if (serviceId) queryParams.push(`service_id=${serviceId}&serviceId=${serviceId}`);
        const queryString = queryParams.join("&");

        response = await globalServerRequest({
          endpoint: `services/getCategoryService${queryString ? `?${queryString}` : ""}`,
          method: "GET"
        });
      }

      if (response.success) {
        initialServiceData = response.data?.data || response.data;
      }
    } catch (e) {
      console.error("Failed to pre-fetch service details on server:", e);
    }
  }

  return <ServiceViewDetail initialData={initialServiceData} />;
}

export default function ServicePage({ searchParams }: PageProps) {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        {/* <Header/> */}
        <Suspense fallback={<div className="text-zinc-500">Loading service details...</div>}>
          <ServicePageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}