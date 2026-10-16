import React from 'react'

interface ReferedDetailProps {
  referdetail:any
}

const ReferralDetailModal = ({referdetail}:ReferedDetailProps) => {

  console.log(referdetail,"dkfksfjf")
  return (
    <div
      className="modal fade"
      id="referaldetailModal"
      data-bs-backdrop="static"
      tabIndex={-1}
      aria-labelledby="SevaServeWorkpopupLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" style={{maxWidth:'1350px'}}>
        <div className="modal-content referral-reward-modal">

          {/* Close Button */}
          <button
            type="button"
            className="btn-close referral-close-btn"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>

          <div className="modal-body">

            {/* Top Info Icon */}
            <div className="referral-info-icon">
              <img
                src="/images/modal/ques-mark-icon.svg"
                alt=""
              />
            </div>

            {/* Heading */}
            <h2>Referral Reward Details</h2>

            <p className="referral-subtitle">
              Invite friends and earn rewards!
            </p>

            {/* User Referral */}
            <div className="referral-card">

              <div className="referral-card-title">
                <div className="referral-title-icon">
                  <i className="fa-regular fa-user"></i>
                </div>

                <h3>For User Referrals</h3>
              </div>

              <div className="referral-reward-row">

                <div className="reward-item">
                  <span className="reward-amount">${referdetail?.user_referral?.your_reward}</span>

                  <div className="reward-content">
                    <h4>Your Reward</h4>
                    <p>
                      Earn ${referdetail?.user_referral?.your_reward} when your
                      <br />
                      referral books a service.
                    </p>
                  </div>
                </div>

                <div className="reward-item">
                  <span className="reward-amount">${referdetail?.user_referral?.friend_reward}</span>

                  <div className="reward-content">
                    <h4>Friend's Reward</h4>
                    <p>
                      Your friend will receive ${referdetail?.user_referral?.friend_reward}
                      <br />
                      after completing qualifying
                      <br />
                      criteria.
                    </p>
                  </div>
                </div>

              </div>

              <div className="referral-bottom-row">

                <div className="referral-bottom-item">
                  <div className="bottom-icon">
                    <i className="fa-regular fa-file-lines"></i>
                  </div>

                  <div>
                    <span>Minimum Qualifying Amount</span>
                    <strong>${referdetail?.user_referral?.minimum_qualifying_amount}</strong>
                  </div>
                </div>

                <div className="referral-bottom-item">
                  <div className="bottom-icon">
                    <i className="fa-regular fa-calendar"></i>
                  </div>

                  <div>
                    <span>Qualification Period</span>
                    <strong>{referdetail?.user_referral?.qualification_period_days} days</strong>
                  </div>
                </div>

              </div>
            </div>

            {/* Provider Referral */}
            <div className="referral-card">

              <div className="referral-card-title">
                <div className="referral-title-icon">
                  {/* <i className="fa-solid fa-user-group"></i> */}
                  <img src="/images/contractor-icon.svg" alt=''/>
                </div>

                <h3>For Technician Referrals</h3>
              </div>

              <div className="referral-reward-row">

                <div className="reward-item">
                  <span className="reward-amount">${referdetail?.provider_referral?.your_reward}</span>

                  <div className="reward-content">
                    <h4>Your Reward</h4>
                    <p>
                      Earn ${referdetail?.provider_referral?.your_reward} when your
                      <br />
                      referred provider qualifies.
                    </p>
                  </div>
                </div>

                <div className="reward-item">
                  <span className="reward-amount">${referdetail?.provider_referral?.provider_reward}</span>

                  <div className="reward-content">
                    <h4>Provider's Reward</h4>
                    <p>
                      The referred provider will receive
                      <br />
                      ${referdetail?.provider_referral?.provider_reward} after meeting the qualifying
                      <br />
                      criteria.
                    </p>
                  </div>
                </div>

              </div>

              <div className="referral-bottom-row">

                <div className="referral-bottom-item">
                  <div className="bottom-icon">
                    <i className="fa-regular fa-file-lines"></i>
                  </div>

                  <div>
                    <span>Minimum Qualifying Amount</span>
                    <strong>${referdetail?.provider_referral?.minimum_qualifying_amount}</strong>
                  </div>
                </div>

                <div className="referral-bottom-item">
                  <div className="bottom-icon">
                    <i className="fa-regular fa-calendar"></i>
                  </div>

                  <div>
                    <span>Qualification Period</span>
                    <strong>${referdetail?.provider_referral?.qualification_period_days} days</strong>
                  </div>
                </div>

              </div>
            </div>

            {/* Got It */}
            <button
              type="button"
              className="referral-got-it-btn"
              data-bs-dismiss="modal"
            >
              Got It
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ReferralDetailModal


