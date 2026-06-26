import Header from '@/components/common/Header'
import React, { Suspense } from 'react'
import SummaryEstimate from './SummaryEstimate'

const page = () => {
  return (
     <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        {/* <Header/> */}
        <Suspense fallback={<div className="text-zinc-500">Loading estimate summary...</div>}>
          <SummaryEstimate/>
        </Suspense>
      </div>
  )
}

export default page
