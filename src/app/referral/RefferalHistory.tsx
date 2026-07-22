"use client";
import { globalServerRequest } from "@/actions/globalApi";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaCaretDown,
} from "react-icons/fa";
import { FiEye, FiX } from "react-icons/fi";

type ReferralStatus = "Pending" | "Paid" | "Expired";
const referralStatuses: ReferralStatus[] = ["Pending", "Paid", "Expired"];

interface ReferralData {
  id: string;
  referredUserName: string;
  referralType: string;
  joinedOn: string;
  joinedYear: string;
  qualifiedSpend: number;
  requiredThreshold: number;
  rewardAmount: number;
  status: ReferralStatus;
  // Missing fields added below for the high-fidelity modal popup
  referrerName: string;
  referrerType: string;
  referredUserType: string;
  qualificationPeriod: string;
  qualificationEnds: string;
  minimumAmount: number;
  rewardReferrer: number;
  rewardReferrerStatus: ReferralStatus;
  rewardReferred: number;
  rewardReferredStatus: ReferralStatus;
  paidOn: string;
}

const dummyData: ReferralData[] = [
  {
    id: "REF-312",
    referredUserName: "John Smith",
    referralType: "User → User",
    joinedOn: "Jan 10,",
    joinedYear: "2026",
    qualifiedSpend: 200,
    requiredThreshold: 200,
    rewardAmount: 20,
    status: "Paid",
    referrerName: "Alice Johnson",
    referrerType: "User",
    referredUserType: "User",
    qualificationPeriod: "30 Days",
    qualificationEnds: "Feb 10, 2026",
    minimumAmount: 200,
    rewardReferrer: 20,
    rewardReferrerStatus: "Paid",
    rewardReferred: 10,
    rewardReferredStatus: "Paid",
    paidOn: "Jan 12, 2026",
  },
  {
    id: "REF-311",
    referredUserName: "Michael Brown",
    referralType: "User → Contractor",
    joinedOn: "Jan 18,",
    joinedYear: "2026",
    qualifiedSpend: 120,
    requiredThreshold: 200,
    rewardAmount: 20,
    status: "Pending",
    referrerName: "Sarah Jenkins",
    referrerType: "User",
    referredUserType: "Contractor",
    qualificationPeriod: "30 Days",
    qualificationEnds: "Feb 18, 2026",
    minimumAmount: 200,
    rewardReferrer: 20,
    rewardReferrerStatus: "Pending",
    rewardReferred: 15,
    rewardReferredStatus: "Pending",
    paidOn: "N/A",
  },
  {
    id: "REF-310",
    referredUserName: "David Lee",
    referralType: "Contractor → User",
    joinedOn: "Jan 20,",
    joinedYear: "2026",
    qualifiedSpend: 80,
    requiredThreshold: 150,
    rewardAmount: 20,
    status: "Pending",
    referrerName: "Robert Downey",
    referrerType: "Contractor",
    referredUserType: "User",
    qualificationPeriod: "45 Days",
    qualificationEnds: "Mar 06, 2026",
    minimumAmount: 150,
    rewardReferrer: 20,
    rewardReferrerStatus: "Pending",
    rewardReferred: 10,
    rewardReferredStatus: "Pending",
    paidOn: "N/A",
  },
  {
    id: "REF-309",
    referredUserName: "Chris Evans",
    referralType: "User → User",
    joinedOn: "Dec 10,",
    joinedYear: "2025",
    qualifiedSpend: 80,
    requiredThreshold: 150,
    rewardAmount: 20,
    status: "Expired",
    referrerName: "Scarlett Johansson",
    referrerType: "User",
    referredUserType: "User",
    qualificationPeriod: "30 Days",
    qualificationEnds: "Jan 10, 2026",
    minimumAmount: 150,
    rewardReferrer: 20,
    rewardReferrerStatus: "Expired",
    rewardReferred: 10,
    rewardReferredStatus: "Expired",
    paidOn: "N/A",
  },
  {
    id: "REF-308",
    referredUserName: "Mark Taylor",
    referralType: "Contractor → Contractor",
    joinedOn: "Dec 05,",
    joinedYear: "2025",
    qualifiedSpend: 150,
    requiredThreshold: 150,
    rewardAmount: 20,
    status: "Paid",
    referrerName: "Chris Hemsworth",
    referrerType: "Contractor",
    referredUserType: "Contractor",
    qualificationPeriod: "30 Days",
    qualificationEnds: "Jan 05, 2026",
    minimumAmount: 150,
    rewardReferrer: 20,
    rewardReferrerStatus: "Paid",
    rewardReferred: 20,
    rewardReferredStatus: "Paid",
    paidOn: "Dec 07, 2025",
  },
];

interface Props {
  initialReferralData: {
    all: any;
    pending: any;
    paid: any;
    expired: any;
  };
}

const RefferalHistory = ({ initialReferralData }: Props) => {
  const [historyData, setHistoryData] = useState(
    initialReferralData.all.data?.data || []
  );
  const [activeFilter, setActiveFilter] = useState<"All" | ReferralStatus>(
    "All"
  );
  const [selectedStatus, setSelectedStatus] = useState<
    ReferralStatus | "Status"
  >("Status");
  const [selectedReferral, setSelectedReferral] = useState<any | null>(null);
  const [referralDetail, setReferralDetail] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  const handleOpenDetails = async (item: any) => {
    setSelectedReferral(item);
    setLoadingDetails(true);
    setReferralDetail(null);
    try {
      const res = await globalServerRequest({
        endpoint: "refer/details",
        method: "POST",
        payload: {
          referral_id: item.id,
        },
      });
      if (res.success && res.data?.success) {
        setReferralDetail(res.data.data);
      } else {
        toast.error(res.data?.message || res.error || "Failed to fetch referral details");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while fetching referral details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedReferral(null);
    setReferralDetail(null);
  };

  const [pagination, setPagination] = useState(
    initialReferralData.all.data?.pagination || {
      pageNo: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 1,
      hasNextPage: false,
    }
  );

  const filteredData = historyData.filter((item: any) => {
    // const matchesTab = activeFilter === "All" ? true : item.status === activeFilter;
    const matchesDropdown =
      selectedStatus === "Status"
        ? true
        : item.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesDropdown;
  });

  const changePage = async (page: number) => {
    console.log("Changing page:", page);

    const status = activeFilter === "All" ? "all" : activeFilter.toLowerCase();

    const res = await globalServerRequest({
      endpoint: "refer/history",
      method: "POST",
      payload: {
        status,
        pageNo: page,
        limit: 10,
      },
    });

    console.log(res);

    if (res.success) {
      setHistoryData(res.data.data.data);
      setPagination(res.data.data.pagination);
    }
  };

  return (
    <div className="referral-page-container">
      <div className="page-title-wrapper">
        <h1 className="page-title">Referral History</h1>
      </div>

      <div className="referral-card">
        <div className="card-header">
          <h2 className="card-title">Past Referrals</h2>
          <select
            className="status-dropdown"
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as ReferralStatus | "Status")
            }
          >
            <option value="Status">Status</option>
            {referralStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="tabs-container">
          {["All", "Pending", "Paid", "Expired"].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter as "All" | ReferralStatus);

                switch (filter) {
                  case "All":
                    setHistoryData(initialReferralData.all.data?.data || []);
                    setPagination(initialReferralData.all.data?.pagination);
                    break;
                  case "Pending":
                    setHistoryData(
                      initialReferralData.pending.data?.data || []
                    );
                    setPagination(initialReferralData.pending.data?.pagination);
                    break;
                  case "Paid":
                    setHistoryData(initialReferralData.paid.data?.data || []);
                    setPagination(initialReferralData.paid.data?.pagination);
                    break;
                  case "Expired":
                    setHistoryData(
                      initialReferralData.expired.data?.data || []
                    );
                    setPagination(initialReferralData.expired.data?.pagination);
                    break;
                }
              }}
              className={`tab-button ${activeFilter === filter ? "active" : ""
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="table-container">
          <table className="referral-table">
            <thead>
              <tr>
                <th>Referral ID</th>
                <th>Referred User</th>
                <th>Type</th>
                <th>
                  Joined On
                  <FaCaretDown
                    className="sort-icon"
                    style={{ color: "#ef4444" }}
                  />
                </th>
                <th>Progress</th>
                <th>Reward</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item: any) => {
                  const progressPercent = item.progress.percentage;
                  let barColorClass = "gray";
                  if (item.status === "Expired") {
                    barColorClass = "gray";
                  } else if (progressPercent === 100) {
                    barColorClass = "green";
                  } else if (progressPercent > 0) {
                    barColorClass = "orange";
                  }

                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600 }}>{item.referral_code}</td>
                      <td>{item.name || "-"}</td>
                      <td className="type-cell">{item.type}</td>
                      <td className="joined-cell">
                        {item.date}
                        {/* {item.joinedOn}
                                                <br />
                                                {item.joinedYear} */}
                      </td>
                      <td>
                        <div className="progress-wrapper">
                          <div className="progress-text">
                            ${item.progress.current_amount} / $
                            {item.progress.target_amount}
                          </div>
                          <div className="progress-bar-container">
                            <div
                              className={`progress-bar ${barColorClass}`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="reward-cell">${item.reward}</td>
                      <td>
                        <span className={`status-badge ${item.status}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-btn"
                          title="View Details"
                          onClick={() => handleOpenDetails(item)}
                        >
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      padding: "3rem 0",
                      color: "#888",
                    }}
                  >
                    No referrals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination-info">
              {/* Showing 1 to {filteredData.length} of 312 results */}
              Showing {(pagination.pageNo - 1) * pagination.limit + 1}
              to
              {Math.min(
                pagination.pageNo * pagination.limit,
                pagination.totalItems
              )}
              of {pagination.totalItems} results
            </div>
            <div className="pagination-controls">
              {/* <button className="page-btn arrow"><FaChevronLeft size={10} /></button> */}
              <button
                className="page-btn arrow"
                disabled={pagination.pageNo === 1}
                onClick={() => changePage(pagination.pageNo - 1)}
              >
                <FaChevronLeft size={10} />
              </button>

              {Array.from({ length: pagination.totalPages }, (_, index) => {
                const page = index + 1;

                return (
                  <button
                    key={page}
                    className={`page-btn ${pagination.pageNo === page ? "active" : ""
                      }`}
                    onClick={() => changePage(page)}
                  >
                    {page}
                  </button>
                );
              })}
              {/* <button className="page-btn arrow"><FaChevronRight size={10} /></button> */}
              <button
                className="page-btn arrow"
                disabled={!pagination.hasNextPage}
                onClick={() => changePage(pagination.pageNo + 1)}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==================== HIGH-FIDELITY MODAL POPUP ==================== */}
      {selectedReferral && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.4)", // slate-900 with opacity
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={handleCloseDetails}
        >
          <div
            style={{
              background: "#FFFFFF",
              width: "100%",
              maxWidth: "460px",
              borderRadius: "20px",
              boxShadow:
                "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
              padding: "24px",
              position: "relative",
              fontFamily: "Inter, sans-serif",
              color: "#1E293B",
            }}
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1E293B",
                  margin: 0,
                }}
              >
                Referral Details
              </h2>
              <button
                onClick={handleCloseDetails}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#94A3B8",
                  fontSize: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  borderRadius: "50%",
                }}
              >
                <FiX />
              </button>
            </div>

            {/* Content Body */}
            {loadingDetails ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 0",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "4px solid #F1F5F9",
                    borderTop: "4px solid #EF4444",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                <span
                  style={{
                    color: "#64748B",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Loading referral details...
                </span>
              </div>
            ) : referralDetail ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "16px" }}
              >
                {/* Referral ID */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#64748B",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Referral ID
                  </span>
                  <span
                    style={{
                      background: "#F1F5F9",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#1E293B",
                    }}
                  >
                    {referralDetail.referral_id || selectedReferral.referral_code || selectedReferral.id}
                  </span>
                </div>

                {/* Referrer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "#64748B",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Referrer
                  </span>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#1E293B",
                      }}
                    >
                      {referralDetail.referrer?.name || "N/A"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>
                      ({referralDetail.referrer?.role || "N/A"})
                    </div>
                  </div>
                </div>

                {/* Referred User */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "#64748B",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Referred User
                  </span>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#1E293B",
                      }}
                    >
                      {referralDetail.referred_user?.name || selectedReferral.name || "N/A"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>
                      ({referralDetail.referred_user?.role || "N/A"})
                    </div>
                  </div>
                </div>

                {/* Type */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#64748B",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Type
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#1E293B",
                    }}
                  >
                    {referralDetail.type || selectedReferral.type}
                  </span>
                </div>

                {/* Joined On */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#64748B",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Joined On
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#1E293B",
                    }}
                  >
                    {referralDetail.joined_on || selectedReferral.date}
                  </span>
                </div>

                {/* Qualification Period */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#64748B",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Qualification Period
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#1E293B",
                    }}
                  >
                    {referralDetail.qualification_period || "N/A"}
                  </span>
                </div>

                {/* Qualification Ends */}
                {selectedReferral?.status?.toLowerCase() !== "paid" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "#64748B",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      Qualification Ends
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#1E293B",
                      }}
                    >
                      {referralDetail.qualification_ends || "N/A"}
                    </span>
                  </div>
                )}

                {/* Minimum Amount */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#64748B",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Minimum Amount
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#1E293B",
                    }}
                  >
                    ${referralDetail.minimum_amount ?? "0"}
                  </span>
                </div>

                {/* Progress Section */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        color: "#64748B",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      Current Spend
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#1E293B",
                      }}
                    >
                      ${referralDetail.current_spend ?? selectedReferral.progress?.current_amount ?? "0"}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "12px" }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: "6px",
                        backgroundColor: "#E2E8F0",
                        borderRadius: "100px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(
                            referralDetail.progress_percentage ?? selectedReferral.progress?.percentage ?? 0,
                            100
                          )}%`,
                          height: "100%",
                          backgroundColor: "#22C55E",
                          borderRadius: "100px",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#22C55E",
                      }}
                    >
                      {Math.round(
                        Math.min(
                          referralDetail.progress_percentage ?? selectedReferral.progress?.percentage ?? 0,
                          100
                        )
                      )}
                      %
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid #F1F5F9",
                    margin: "8px 0",
                  }}
                />

                {/* Reward (Referrer) */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#64748B",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Reward (Referrer)
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#1E293B",
                      }}
                    >
                      ${referralDetail.reward_referrer?.amount ?? "0"}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color:
                          referralDetail.reward_referrer?.status?.toLowerCase() === "paid"
                            ? "#10B981"
                            : referralDetail.reward_referrer?.status?.toLowerCase() === "pending"
                              ? "#F59E0B"
                              : "#94A3B8",
                        backgroundColor:
                          referralDetail.reward_referrer?.status?.toLowerCase() === "paid"
                            ? "#ECFDF5"
                            : referralDetail.reward_referrer?.status?.toLowerCase() === "pending"
                              ? "#FFFBEB"
                              : "#F1F5F9",
                        padding: "2px 8px",
                        borderRadius: "100px",
                        textTransform: "capitalize",
                      }}
                    >
                      {referralDetail.reward_referrer?.status || "Pending"}
                    </span>
                  </div>
                </div>

                {/* Reward (Referred) */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#64748B",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Reward (Referred)
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#10B981",
                      }}
                    >
                      ${referralDetail.reward_referred?.amount ?? "0"}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "700",
                        color:
                          referralDetail.reward_referred?.status?.toLowerCase() === "paid"
                            ? "#10B981"
                            : referralDetail.reward_referred?.status?.toLowerCase() === "pending"
                              ? "#F59E0B"
                              : "#94A3B8",
                        backgroundColor:
                          referralDetail.reward_referred?.status?.toLowerCase() === "paid"
                            ? "#ECFDF5"
                            : referralDetail.reward_referred?.status?.toLowerCase() === "pending"
                              ? "#FFFBEB"
                              : "#F1F5F9",
                        padding: "2px 8px",
                        borderRadius: "100px",
                        textTransform: "capitalize",
                      }}
                    >
                      {referralDetail.reward_referred?.status || "Pending"}
                    </span>
                  </div>
                </div>

                {/* Paid On */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#64748B",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Paid On
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#1E293B",
                    }}
                  >
                    {referralDetail.paid_on || "N/A"}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#64748B" }}>
                <p>Failed to load referral details.</p>
                <button
                  onClick={() => handleOpenDetails(selectedReferral)}
                  style={{
                    marginTop: "8px",
                    padding: "8px 16px",
                    background: "#EF4444",
                    color: "#FFF",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RefferalHistory;
