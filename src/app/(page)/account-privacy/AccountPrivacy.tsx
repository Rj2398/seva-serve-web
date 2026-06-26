import Link from 'next/link'
import React from 'react'

const AccountPrivacy = () => {
  return (
       <main>
      <div className="container home-wraper my-profile">
        <section>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="browse-wrp">
                  <div className="browse-ctg-head my-con-head">
                    <h2 className="sub-cate-page">
                      <Link href="/home">
                        <img src="images/home/left-arrow.svg" alt="" />
                      </Link>
                      Account Privacy
                    </h2>
                  </div>

                  <div className="about-us-body">
                    <p className="about-us-data">
                      SevaServe values your privacy and gives you full control over your personal
                      information. You can manage your account settings anytime including changing
                      your password, updating contact details, or deleting your account directly
                      from Settings → Account Privacy. If you choose to delete your account, all
                      your data including past bookings, chat history, and saved preferences will
                      be permanently erased and cannot be recovered.
                    </p>

                    <p className="about-us-data">
                      SevaServe values your privacy and gives you full control over your personal
                      information. You can manage your account settings anytime including changing
                      your password, updating contact details, or deleting your account directly
                      from Settings → Account Privacy. If you choose to delete your account, all
                      your data including past bookings, chat history, and saved preferences will
                      be permanently erased and cannot be recovered.
                    </p>

                    <div className="about-swap-inner">
                      <div className="inner-data">
                        <a href="#deleteAccountModal" data-bs-toggle="modal">
                          <span>
                            <img
                              src="images/inner-page/delete-icon.svg"
                              alt=""
                            />
                            Delete Account
                          </span>

                          <img
                            src="images/inner-page/right-side-move.svg"
                            alt=""
                          />
                        </a>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AccountPrivacy
