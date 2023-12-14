import Box from "@/components/Box";
import Typography from "@/components/Typography";
import Paper from "@/components/Paper";
import { cookies } from "next/headers";

import { getPermissions, getUser } from "@/utils/api";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Data Uses",
    description: "",
};

export default async function TeamDataUsesPage() {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = await getPermissions(user.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["fe.account.nav.dur"]}>
            <Paper>
                <Box>
                    <Typography variant="h2">Data Uses</Typography>
                </Box>
            </Paper>
        </ProtectedAccountRoute>
    );
}
