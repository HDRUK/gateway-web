import Box from "@/components/Box";
import Paper from "@/components/Paper";
import { cookies } from "next/headers";
import { getCohort, getPermissions, getUser } from "@/utils/permissions";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import StatusForm from "./StatusForm";
import ReadOnly from "./ReadOnly";
import DecisionHistory from "./DecisionHistory";
import Header from "./Header";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Cohort Discovery Manage",
    description: "",
};

export default async function CohortDiscoveryManage({
    params,
}: {
    params: { userId: string };
}) {
    const { userId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = await getPermissions(user.roles);
    const cohortRequest = await getCohort(cookieStore, userId);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["cohort.read"]}>
            <Paper>
                <Box>
                    <Header cohortRequest={cohortRequest} />
                    <StatusForm cohortRequest={cohortRequest} />
                    <ReadOnly cohortRequest={cohortRequest} />
                    <DecisionHistory cohortRequest={cohortRequest} />
                </Box>
            </Paper>
        </ProtectedAccountRoute>
    );
}
