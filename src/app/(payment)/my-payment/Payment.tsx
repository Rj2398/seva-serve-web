"use client"
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import { globalServerRequest } from '@/actions/globalApi'
import LogoLoader from '@/components/common/LogoLoader'

const Payment = () => {
    const router = useRouter()

    const [activeTab, setActiveTab] = useState('all');
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [limit] = useState(5);
    const [pagination, setPagination] = useState<any>(null);
    const observerTarget = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && pagination?.hasNextPage && !loading) {
                    setPageNo((prev) => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        const currentTarget = observerTarget.current;
        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [pagination, loading]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setPageNo(1);
    };

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            setLoading(true);
            try {
                const payload: any = {
                    pageNo,
                    limit,
                };
                if (activeTab !== 'all') {
                    payload.status = activeTab;
                }
                const response = await globalServerRequest({
                    endpoint: "payment/payment-history",
                    method: "POST",
                    payload,
                });
                if (response.success) {
                    const resData = response.data?.data || response.data;
                    setPayments(prev => pageNo === 1 ? (resData?.payments || []) : [...prev, ...(resData?.payments || [])]);
                    setPagination(resData?.pagination || null);
                } else {
                    if (pageNo === 1) setPayments([]);
                    setPagination(null);
                }
            } catch (error) {
                console.error("Error fetching payment history:", error);
                if (pageNo === 1) setPayments([]);
                setPagination(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentHistory();
    }, [activeTab, pageNo, limit]);

    const formatPaidAt = (paidAtStr: string) => {
        if (!paidAtStr) return { date: '-', time: '' };
        try {
            const formattedStr = paidAtStr.replace(' ', 'T');
            const date = new Date(formattedStr);
            if (isNaN(date.getTime())) {
                return { date: paidAtStr, time: '' };
            }
            const d = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
            const t = date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
            return { date: d, time: t };
        } catch (e) {
            return { date: paidAtStr, time: '' };
        }
    };

    return (
        <div>
            <main>
                <div className="container home-wraper my-profile">
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
                                                My Payments
                                            </h2>
                                            <div className="tab-left">
                                                <ul className="nav nav-pills mb-3" id="customTabs-tab">
                                                    {['all', 'paid', 'pending'].map((tab) => (
                                                        <li className="nav-item" key={tab}>
                                                            <button
                                                                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                                                onClick={() => handleTabChange(tab)}
                                                                style={{ textTransform: 'capitalize' }}
                                                            >
                                                                {tab}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="tab-content">
                                            <div className="my-payments-body-wrp">
                                                {loading && pageNo === 1 ? (
                                                    <LogoLoader />
                                                ) : (
                                                    <>
                                                        {payments.map((item) => {
                                                            const isPaid = item.status === 'paid';
                                                            const isPending = item.status === 'pending' || item.status === 'unpaid';
                                                            const statusText = item.status
                                                                ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                                                                : 'Pending';
                                                            const title = item.category_name
                                                                ? `${item.category_name}${item.sub_categories && item.sub_categories.length > 0 ? ` - ${item.sub_categories.join(', ')}` : ''}`
                                                                : `Payment for ${item.type || 'Booking'}`;
                                                            const amountText = item.currency === 'USD' || !item.currency ? `$${item.amount}` : `${item.currency} ${item.amount}`;
                                                            const { date, time } = formatPaidAt(item.paid_at || item.created_at);

                                                            // Determine query parameters for checkout redirection
                                                            const checkoutUrl = `/checkout?booking_id=${item.booking_id}&initialpayment=${item.payment_type === 'initial' ? item.amount : 0}&remaingPayment=${item.payment_type === 'full' ? item.amount : 0}&paymenttype=${item.payment_type}`;

                                                            return (
                                                                <div className="my-payments-body" key={item.transaction_id || item.id}>
                                                                    <div className="left-payments-body">
                                                                        <div className="plumbing-icon">
                                                                            <img src={item?.booking_image || ""} alt={title} />
                                                                        </div>
                                                                        <div className={`paid ${isPending ? 'pending' : ''}`}>
                                                                            <h5>
                                                                                {title}
                                                                                <span>
                                                                                    <img
                                                                                        src={isPaid ? "images/inner-page/paidcircle-tick.svg" : "images/inner-page/pending-clock-icon.svg"}
                                                                                        alt=""
                                                                                    />
                                                                                    {statusText}
                                                                                </span>
                                                                            </h5>
                                                                            <p>{date} {time ? `• ${time}` : ''}</p>
                                                                            <p className="amount">Amount : <span>{amountText}</span></p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="right-payments-body">
                                                                        <button className="secondary-cta" onClick={() => router.push(`/view-booking-detail?bookingId=${item.booking_id}`)}>
                                                                            View Job
                                                                        </button>
                                                                        {isPending && (
                                                                            <button
                                                                                className="primary-cta"
                                                                                onClick={() => router.push(checkoutUrl)}
                                                                            >
                                                                                <img
                                                                                    className="pay"
                                                                                    src="images/modal/notice-right-arrow.svg"
                                                                                    alt=""
                                                                                />
                                                                                Pay Now
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}

                                                        {payments.length === 0 && (
                                                            <p className="text-center">No {activeTab} payments found.</p>
                                                        )}

                                                        {pagination && pagination.hasNextPage && (
                                                            <div ref={observerTarget} style={{ height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                {loading && <div className="spinner-border text-danger spinner-border-sm" role="status"><span className="visually-hidden">Loading...</span></div>}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Payment
