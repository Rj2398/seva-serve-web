import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const ReviewAdditionalServices = () => {

  const router = useRouter()
  return (
    <>
     <div className="modal fade welcome" id="reviewAdditional" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="welcome-seva-ser">
                  <img src="images/modal/review-check.svg" className="check" alt=""/>
                  <h4>Review Additional Services</h4>
                  <p>The contractor has requested additional services for this job.</p>
                  <p> Please review the details and quotation carefully before making a decision.</p>
<Link 
  href="/quotes" 
  className="primary-cta requ-suc same"
  onClick={(e) => {
    // 1. Prevent normal link navigation so we can clear the modal backdrop first
    e.preventDefault();

    // 2. Find the active Bootstrap modal currently visible on your screen
    const modalElement = document.querySelector('.modal.show'); 
    
    if (modalElement) {
      const bootstrap = (window as any).bootstrap;
      if (bootstrap && bootstrap.Modal) {
        // 3. Fetch the modal instance and shut it down cleanly
        const modalInstance = bootstrap.Modal.getInstance(modalElement) 
          || new bootstrap.Modal(modalElement);
        
        modalInstance.hide();
      }
    }

    // 4. Fire the Next.js router redirection immediately after closing
    router.push("/quotes");
  }}
>
  Go to My Quotes
</Link>
                </div>
              </div>
              
            </div>
          </div>
        </div>
    </>
  )
}

export default ReviewAdditionalServices
