import React from 'react'
import BookingUpdate from './BookingUpdate'
import { globalServerRequest } from '@/actions/globalApi';



interface SearchParams {
  bookingId?: string;
  late_alert_id?: string;
}


const page = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {

  const resolvedSearchParams = await searchParams;
  const bookingId = resolvedSearchParams.bookingId;
  const late_alert_id = resolvedSearchParams.late_alert_id;
  console.log("late_alert_id", late_alert_id, "  bookingId", bookingId)

  let initialData = null;

  try {
    let res = await globalServerRequest({
      endpoint: "booking/get-running-late-request",
      method: "POST",
      payload: {
        booking_id: Number(bookingId),
        late_alert_id: Number(late_alert_id),

      }
    })

    if (res.success) {
      console.log("res", res.data)
      initialData = res.data?.data
      console.log("initialData", initialData)
    }

  } catch (error) {
    console.log(error)
  }



  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <BookingUpdate bookingData={initialData} />
    </div>
  )
}

export default page