import { redirect } from "next/navigation";
import { ROLE_HDRUK_SUPERADMIN } from "@/consts/roles";
import { RouteName } from "@/consts/routeName";
import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import FeatureFlagsTable from "../../FeatureFlagsTable";

export const metadata = metaData(
    {
        title: "Features",
        description: "",
    },
    noFollowRobots
);
export default async function FeaturesPage({
    params,
}: {
    params: Promise<{ userId: string }>;
}) {
    const { userId } = await params;

    const user = await getUser();
    const isSuperAdmin = user.roles.some(
        role => role.name === ROLE_HDRUK_SUPERADMIN
    );
    if (!isSuperAdmin) {
        redirect(RouteName.ERROR_403);
    }

    return <FeatureFlagsTable userId={userId} />;
}
