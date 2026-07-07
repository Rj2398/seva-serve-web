import React from 'react'
import PrivacyPolicy from './PrivacyPolicy'
import { globalServerRequest } from '@/actions/globalApi';

// const page = () => {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
//       <PrivacyPolicy />
//     </div>
//   )
// }

// export default page


export default async function PrivacyPolicyPage() {
  let initialPrivacyPolicyData = {
    privacyPolicy: {},
  };


  const [privacyPolicy] = await Promise.all([
    globalServerRequest({
      endpoint: "config?type=legal&label=privacy",
      method: "GET",
    }),
  ])
  console.log("privacyPolicy A", privacyPolicy)

  if (privacyPolicy.success) {
    initialPrivacyPolicyData.privacyPolicy = privacyPolicy.data?.data || privacyPolicy.data || {};
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <PrivacyPolicy initialPrivacyPolicyData={initialPrivacyPolicyData} />
    </div>
  )
}