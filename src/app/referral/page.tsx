import { globalServerRequest } from "@/actions/globalApi"
import RefferalHistory from "./RefferalHistory"

export default async function RefferalHistoryPage() {
    const initialReferralData = {
        all: {},
        pending: {},
        paid: {},
        expired: {},
    };

    try {
        const [allRes, pendingRes, paidRes, expiredRes] = await Promise.all([


            globalServerRequest({
                endpoint: "refer/history",
                method: "POST",
                payload: {
                    status: "all", pageNo: 1,
                    limit: 2,
                }
            }),

            globalServerRequest({
                endpoint: "refer/history",
                method: "POST",
                payload: {
                    status: "pending",
                    pageNo: 1,
                    limit: 10,
                },
            }),
            globalServerRequest({
                endpoint: "refer/history",
                method: "POST",
                payload: {
                    status: "paid",
                    pageNo: 1,
                    limit: 10,
                },
            }),
            globalServerRequest({
                endpoint: "refer/history",
                method: "POST",
                payload: {
                    status: "expired",
                    pageNo: 1,
                    limit: 10,
                },
            }),
        ]);

        if (allRes.success) {
            initialReferralData.all = allRes.data;
        }
        if (pendingRes.success) {
            initialReferralData.pending = pendingRes.data;
        }
        if (paidRes.success) {
            initialReferralData.paid = paidRes.data;
        }
        if (expiredRes.success) {
            initialReferralData.expired = expiredRes.data;
        }

        console.log("referredData@@@@@@@11", initialReferralData);

    } catch (error) {
        console.error("Failed to load refferred data:", error);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
            <RefferalHistory initialReferralData={initialReferralData} />
        </div>
    )

}

