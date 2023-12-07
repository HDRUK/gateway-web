import Box from "@/components/Box";
import Typography from "@/components/Typography";
import Paper from "@/components/Paper";
import { cookies } from "next/headers";

import { getPermissions, getUser } from "@/utils/permissions";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";

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

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["cohort.read"]}>
            <Paper>
                <Box>
                    <Typography variant="h2">
                        Cohort Discovery Manage - {userId}
                    </Typography>
                </Box>
            </Paper>
        </ProtectedAccountRoute>
    );
}
