import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Paper from "@/components/Paper";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import Typography from "@/components/Typography";
import {
    ACCOUNT,
    DATASETS,
    DUPLICATE,
    PAGES,
    TEAM,
    TEXT,
    TITLE,
} from "@/consts/translation";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import CreateDataset from "../components/CreateDataset";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Dataset Create",
    description: "",
};

export default async function TeamDatasetsPage({
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

    const t = await getTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${DUPLICATE}`
    );

    // to do - get form content here

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["datasets.create"]}>
            <BoxContainer sx={{ gap: 0 }}>
                <Paper>
                    <Box sx={{ bgcolor: "white", mb: 0 }}>
                        <Typography variant="h2">{t(TITLE)}</Typography>
                        <Typography>{t(TEXT)}</Typography>
                    </Box>
                </Paper>
                <CreateDataset />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
