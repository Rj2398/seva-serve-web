export const dynamic = "force-dynamic";

import React from "react";
import ChoosePlan from "./ChoosePlan";
import { globalServerRequest } from "@/actions/globalApi";

// const page = () => {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
//       <ChoosePlan />
//     </div>
//   )
// }

// export default page

export default async function ChoosePlanPage() {
  let initialPlanData = {
    plans: [],
  };

  try {
    const [plan] = await Promise.all([
      globalServerRequest({
        endpoint: "subscription/get-plan",
        method: "GET",
      }),
    ]);
    console.log("plan", plan);
    if (plan.success) {
      initialPlanData.plans = plan.data?.data || plan.data || [];
    }
    console.log("initialPlanData", initialPlanData);
  } catch (error) {
    console.error("Failed to fetch plan on server side:", error);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <ChoosePlan initialPlanData={initialPlanData} />
    </div>
  );
}
