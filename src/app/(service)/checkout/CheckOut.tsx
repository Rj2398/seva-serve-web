"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";

const CheckOut = () => {
    const router = useRouter();
    return (
        <main>
            <div className="container home-wraper my-profile" style={{ height: "auto" }}>
                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="browse-wrp">
                                    <div className="browse-ctg-head my-con-head">
                                        <h2 className="sub-cate-page">
                                            <button onClick={() => router.back()} className="btn p-0 m-0">
                                                <img src="images/home/left-arrow.svg" alt="" />
                                            </button>
                                            Checkout
                                        </h2>
                                    </div>
                                </div>
                                <div className="checkout-wrp">
                                    <div className="checkout-steps">
                                        <div className="checkout-step-in check">
                                            <div className="checkout-step-in-count">
                                                <i className="fa-solid fa-check"></i>
                                            </div>
                                            <div className="checkout-step-in-data">
                                                <h5>Step 1</h5>
                                                <p>Accept Job</p>
                                            </div>
                                        </div>
                                        <div className="checkout-step-in">
                                            <div className="checkout-step-in-count">
                                                02
                                            </div>
                                            <div className="checkout-step-in-data">
                                                <h5>Step 2</h5>
                                                <p>Payment</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cost-details-wrp">
                                        <h4>Booking Cost Details</h4>
                                        <div className="cost-details-in">
                                            <p>Deposit / Deductible Amount <span>$10</span></p>
                                            <p>Remaining Cost <span>$70</span></p>
                                            <hr />
                                            <p>Total Cost <span><b>$80</b></span></p>
                                        </div>
                                    </div>
                                    <div className="select-pay-met">
                                        <h4>Select Payment Method</h4>
                                        <ul>
                                            <li><input type="radio" value="1" name="payment-method" defaultChecked /> Credit Card (Stripe)</li>
                                            <li><input type="radio" value="2" name="payment-method" /> Zelle</li>
                                            <li><input type="radio" value="3" name="payment-method" /> Venmo</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card-help">
                                    <Link href="/payment-method" className="primary-cta">Confirm Payment</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    )
}

export default CheckOut