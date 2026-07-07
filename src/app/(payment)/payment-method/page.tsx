
import React from 'react'
import PaymentMethod from './PaymentMethod'
import { globalServerRequest } from '@/actions/globalApi';


export default async function PaymentPage() {


  let initialCardsData = {
    cards: [],
  };

  const response = await globalServerRequest({
    endpoint: "payment/card/fetch-cards",
    method: "GET",
  });


  if (response.success) {
    initialCardsData.cards = response.data?.data || response.data || [];
  } else {
    initialCardsData = { cards: [] };
  }



  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <PaymentMethod initialCardsData={initialCardsData} />
    </div>
  )
}
