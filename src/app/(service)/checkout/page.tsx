import React from 'react'
import CheckOut from './CheckOut'
import { globalServerRequest } from '@/actions/globalApi';

interface SearchParams {
  booking_id?: string;
  bookingId?: string;
  paymenttype?: string;
}

const page = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const resolvedSearchParams = await searchParams;
  const bookingId = resolvedSearchParams.booking_id || resolvedSearchParams.bookingId;

  console.log("bookingId",bookingId)

  let initialData = null;

  try {
    if (bookingId) {
      let res = await globalServerRequest({
        endpoint: "profile/job-tracking",
        method: "POST",
        payload: {
          bookingId: Number(bookingId)
        }
      })

      if (res.success) {
        initialData = res.data?.data;
      }
    }
  } catch (error) {
    console.log(error)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <CheckOut bookingData={initialData} />
    </div>
  )
}

export default page