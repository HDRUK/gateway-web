import Box from "@/components/Box";
import Typography from "@/components/Typography";
import Paper from "@/components/Paper";
import CohortTable from "@/modules/CohortTable";
import CohortTableDownload from "@/modules/CohortTableDownload";
import { cookies } from "next/headers";

import { getPermissions, getUser } from "@/utils/permissions";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Cohort Discovery Admin",
    description: "",
};

export default async function CohortDiscoveryAdmin() {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = await getPermissions(user.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["cohort.read"]}>
            <Paper>
                <Box>
                    <Typography variant="h2">Cohort Discovery Admin</Typography>
                    <Box sx={{ p: 0, display: "flex" }}>
                        <Typography sx={{ marginBottom: 4, mx: 1 }}>
                            Find and manage status of all Cohort Discovery
                            users, Click individual account users name to access
                            decision page to review and edit status
                        </Typography>

                        <CohortTableDownload />
                    </Box>
                    <CohortTable />
                </Box>
            </Paper>
        </ProtectedAccountRoute>
    );
}
