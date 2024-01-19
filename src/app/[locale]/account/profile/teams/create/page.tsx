import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import Typography from "@/components/Typography";
import { TEXT, TITLE } from "@/consts/translation";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import CreateTeamForm from "./components/CreateTeamForm";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Create Team",
    description: "",
};

export default async function CreateTeamPage() {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = getPermissions(user.roles);

    const t = await getTranslations("pages.account.profile.teams.create");

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["custodians.create"]}>
            <BackButton label={t("backButton")} />
            <Paper sx={{ marginBottom: 1 }}>
                <Box>
                    <Typography variant="h2">{t(TITLE)}</Typography>
                    <Typography>{t(TEXT)}</Typography>
                </Box>
            </Paper>
            <CreateTeamForm />
        </ProtectedAccountRoute>
    );
}
