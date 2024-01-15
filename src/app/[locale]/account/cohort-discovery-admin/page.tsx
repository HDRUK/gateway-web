import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import Typography from "@/components/Typography";
import {
    ACCOUNT,
    COHORT_DISCOVERY_ADMIN,
    PAGES,
    TEXT,
    TITLE,
} from "@/consts/translation";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import CohortTable from "./components/CohortTable";
import CohortTableDownload from "./components/CohortTableDownload";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Cohort Discovery Admin",
    description: "",
};

export default async function CohortDiscoveryAdmin() {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = await getPermissions(user.roles);
    const t = await getTranslations(
        `${PAGES}.${ACCOUNT}.${COHORT_DISCOVERY_ADMIN}`
    );

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["cohort.read"]}>
            <Paper>
                <Box>
                    <Typography variant="h2">{t(TITLE)}</Typography>
                    <Box sx={{ p: 0, display: "flex" }}>
                        <Typography sx={{ marginBottom: 4, mx: 1 }}>
                            {t(TEXT)}
                        </Typography>
                        <CohortTableDownload />
                    </Box>
                    <CohortTable />
                </Box>
            </Paper>
        </ProtectedAccountRoute>
    );
}
