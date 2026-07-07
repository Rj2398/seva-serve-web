import React from 'react'
import About from './About'
import { globalServerRequest } from '@/actions/globalApi';

// const page = () => {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
//       <About />
//     </div>
//   )
// }

// export default page


export default async function AboutPage() {
  let initialAboutData = {
    about: {},
  };

  const [about] = await Promise.all([
    globalServerRequest({
      endpoint: "config?type=legal&label=about",
      method: "GET",
    }),
  ])

  if (about.success) {
    initialAboutData.about = about.data?.data || about.data || {};
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <About initialAboutUs={initialAboutData} />
    </div>
  )
}
