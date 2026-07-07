import React from 'react'
import TermCondition from './TermCondition'
import { globalServerRequest } from '@/actions/globalApi';

// const page = () => {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
//       <TermCondition />
//     </div>
//   )
// }

// export default page


export default async function TermConditionPage() {

  let initialTermAndConditionsData = {
    termAndConditions: {},
  };


  const [tAndc] = await Promise.all([
    globalServerRequest({
      endpoint: "config?type=legal&label=terms",
      method: "GET",

    }),
  ])
  console.log("tAndc", tAndc)
  if (tAndc.success) {
    initialTermAndConditionsData.termAndConditions = tAndc.data?.data || tAndc.data || {};
  }

  console.log("object", initialTermAndConditionsData)
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <TermCondition initialTAndCData={initialTermAndConditionsData} />
    </div>
  )
}