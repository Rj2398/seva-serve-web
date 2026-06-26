import React from "react";

const SevaServeWorkModal = () => {
  return (
    <div
      className="modal fade"
      id="SevaServeWorkpopup"
      data-bs-backdrop="static"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">

        <div className="modal-content">

          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>

          <div className="modal-body">

            <div className="working-process">

              <div className="ques-mrk-icon">
                <img
                  src="/images/modal/ques-mark-icon.svg"
                  alt=""
                />
              </div>

              <h2>How SevaServe Works</h2>

              <div className="work-list">

                <ul>

                  <li>
                    <span>1</span>

                    <p>
                      Tell us what service you need or explain your issue.
                    </p>
                  </li>

                  <li>
                    <span>2</span>

                    <p>
                      We match you with verified, trained professionals nearby.
                    </p>
                  </li>

                  <li>
                    <span>3</span>

                    <p>
                      Check service details, pricing, and expert profiles.
                    </p>
                  </li>

                  <li>
                    <span>4</span>

                    <p>
                      Select your date & time and book the service instantly.
                    </p>
                  </li>

                  <li>
                    <span>5</span>

                    <p>
                      Track your booking, chat with expert & manage updates.
                    </p>
                  </li>

                </ul>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default SevaServeWorkModal;