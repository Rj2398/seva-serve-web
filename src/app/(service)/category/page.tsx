export const dynamic = "force-dynamic";

import React from 'react'
import Category from './Category'
import { globalServerRequest } from '@/actions/globalApi';

const page = async () => {
  let initialData = null;


  try {
    const response = await globalServerRequest({
      endpoint: "services/categories",
      method: "GET",
    })
    initialData = response?.data;
  } catch (error) {
    console.log(error)
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <Category initialData={initialData} />
    </div>
  )
}

export default page