import { cookies } from "next/headers";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getCohort, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metdata";
import { getPermissions } from "@/utils/permissions";
import DecisionHistory from "./DecisionHistory";
import Header from "./Header";
import ReadOnly from "./ReadOnly";
import StatusForm from "./StatusForm";

export const metadata = metaData(
    {
        title: "Cohort Discovery Manage - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function CohortDiscoveryManage({
    params,
}: {
    params: { cohortId: string };
}) {
    const { cohortId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = await getPermissions(user.roles);
    const cohortRequest = await getCohort(cookieStore, cohortId);

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
