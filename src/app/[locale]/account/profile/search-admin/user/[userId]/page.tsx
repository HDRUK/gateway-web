import { redirect } from "next/navigation";
import { RouteName } from "@/consts/routeName";
import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { isSuperAdmin } from "@/utils/permissions";
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
    if (!isSuperAdmin(user.roles)) {
        redirect(RouteName.ERROR_403);
    }

    return <FeatureFlagsTable userId={userId} />;
}
