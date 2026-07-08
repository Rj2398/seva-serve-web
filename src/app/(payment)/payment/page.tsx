export const dynamic = "force-dynamic";

import React, { Suspense } from 'react'
import PaymentPage from './PaymentPage'

const page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <Suspense fallback={<div className="text-zinc-500">Loading payment...</div>}>
        <PaymentPage />
      </Suspense>
    </div>
  )
}

export default page

