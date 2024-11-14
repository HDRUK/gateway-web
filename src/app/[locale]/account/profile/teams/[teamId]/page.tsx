import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import BackButton from "@/components/BackButton";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import CreateTeamForm from "../components/CreateTeamForm";

export const metadata = metaData(
    {
        title: "Edit Team - My Account",
        description: "",
    },
    noFollowRobots
);

export default async function EditTeamPage() {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = getPermissions(user.roles);

    const t = await getTranslations("pages.account.profile.teams.create");

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["custodians.update"]}>
            <BackButton label={t("backButton")} />
            <CreateTeamForm />
        </ProtectedAccountRoute>
    );
}
