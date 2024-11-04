import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import BackButton from "@/components/BackButton";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import CreateTeamForm from "../components/CreateTeamForm";
import metaData, { noFollowRobots } from "@/utils/metdata";

export const metadata = metaData(
    {
        title: "Create Team - My Account",
        description: "",
    },
    noFollowRobots
);

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
            <CreateTeamForm />
        </ProtectedAccountRoute>
    );
}
