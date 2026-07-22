import { globalServerRequest } from "@/actions/globalApi";
import ViewBookingDetail from "./ViewBookingDetail"


interface SearchParams {
  bookingId?: string;
}

const page = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const resolvedSearchParams = await searchParams;
  const bookingId = resolvedSearchParams.bookingId;

  let initialData = null;


  try {
    let res = await globalServerRequest({
      endpoint: "profile/job-tracking",
      method: "POST",
      payload: {
        bookingId: Number(bookingId)
      }
    })

    if (res.success) {
      console.log("res", res.data)
      initialData = res.data?.data
    }

  } catch (error) {
    console.log(error)
  }


  console.log("bookingtrackingData", initialData)
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <ViewBookingDetail bookingData={initialData} />
    </div>
  )
}

export default page
