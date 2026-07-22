import { globalServerRequest } from "@/actions/globalApi"
import RefferalHistory from "./RefferalHistory"


// export default async function RefferalHistoryPage() {
//     let referredData = null;

//     try {
//          referredData = await globalServerRequest({
//                 endpoint: "refer/history",
//                 method: "POST",
//                 payload: {status: "pending", per_page:5}
//             });
//         console.log("referredData@@@@@@@11", referredData);

//     } catch (error) {
//         console.error("Failed to load refferred data:", error);
//     }

//     return (
//         <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
//             {/* <RefferalHistory referredData = {referredData} /> */}
//             <RefferalHistory referredData={referredData} />
//         </div>
//     )

// }
export default async function RefferalHistoryPage() {
    let initialReferralData = {
        // all: [],
        // pending: [],
        // paid: [],
        // expired: [],
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
                    limit: 10,
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

        // console.log("referredData@@@@@@@11", initialReferralData);

        if (allRes.success) {
            // initialReferralData.all = allRes.data?.data || []
            initialReferralData.all = allRes.data;
        }
        if (pendingRes.success) {
            // initialReferralData.pending = pendingRes.data?.data || []
            initialReferralData.pending = pendingRes.data;
        }
        if (paidRes.success) {
            // initialReferralData.paid = paidRes.data?.data || []
            initialReferralData.paid = paidRes.data;
        }
        if (expiredRes.success) {
            // initialReferralData.expired = expiredRes.data?.data || []
            initialReferralData.expired = expiredRes.data;
        }

        console.log("referredData@@@@@@@11", initialReferralData);

    } catch (error) {
        console.error("Failed to load refferred data:", error);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
            {/* <RefferalHistory referredData = {referredData} /> */}
            <RefferalHistory initialReferralData={initialReferralData} />
        </div>
    )

}

