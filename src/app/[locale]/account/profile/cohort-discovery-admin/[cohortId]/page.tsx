import { getTranslations } from "next-intl/server";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getCohort, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import DecisionHistory from "./DecisionHistory";
import Header from "./Header";
import ReadOnly from "./ReadOnly";
import StatusForm from "./StatusForm";

const TRANSLATION_PATH = "pages.account.profile.cohortDiscoveryAdmin";

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
    params: Promise<{ cohortId: string }>;
}) {
    const { cohortId } = await params;
    const t = await getTranslations(TRANSLATION_PATH);
    const user = await getUser();
    const permissions = await getPermissions(user.roles);
    const cohortRequest = await getCohort(cohortId);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["cohort.read"]}>
            <BackButton label={t("backButtonLabel")} />
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
