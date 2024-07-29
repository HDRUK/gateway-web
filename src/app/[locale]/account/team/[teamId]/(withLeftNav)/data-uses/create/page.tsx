import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import Typography from "@/components/Typography";
import { ACCOUNT, DATA_USES, PAGES, TEAM } from "@/consts/translation";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import CreateDataUse from "./components/CreateDataUse";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Data Use Create",
    description: "",
};

export default async function DataUseCreatePage({
    params,
}: {
    params: { teamId: string };
}) {
    const { teamId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const team = await getTeam(cookieStore, teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    const t = await getTranslations(`${PAGES}.${ACCOUNT}.${TEAM}.${DATA_USES}`);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["dur.read"]}>
            <Paper>
                <Box>
                    <Typography variant="h2">{t("createDataUse")}</Typography>
                </Box>
                <CreateDataUse teamId={teamId} />
            </Paper>
        </ProtectedAccountRoute>
    );
}
