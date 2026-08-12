"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'




interface TermConditionProps {
  initialTAndCData?: {
    termAndConditions: any;
  };
}


export default function TermCondition({ initialTAndCData }: TermConditionProps) {
  const router = useRouter();

  const [termAndCond, setTermAndCond] = useState<any>(
    initialTAndCData?.termAndConditions
  );



  console.log("termAndCond", termAndCond)




  return (
    <>
      <main>
        <div className="container home-wraper my-profile">

          <section>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="browse-wrp">
                    <div className="browse-ctg-head my-con-head">
                      <h2 className="sub-cate-page"> <a href="#" onClick={(e) => { e.preventDefault(); router.back(); }}><img src="images/home/left-arrow.svg" alt="" /></a>{termAndCond.title}</h2>

                    </div>
                    <div className="about-us-body">
                      <div dangerouslySetInnerHTML={{ __html: termAndCond.content }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}


