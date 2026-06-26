import Header from '@/components/common/Header'
import React from 'react'
import Subscription from './Subscription'

const page = () => {
  return (
     <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        {/* <Header/> */}
         <Subscription/>
       </div>
  )
}

export default page
