import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import FeatureFlagsTable from "./FeatureFlagsTable";
import { redirect } from "next/navigation";
import { RouteName } from "@/consts/routeName";
import { ROLE_HDRUK_SUPERADMIN } from "@/consts/roles";

export const metadata = metaData(
    {
        title: "Features",
        description: "",
    },
    noFollowRobots
);
export default async function FeaturesPage() {
    const user = await getUser();
    const isSuperAdmin = user.roles.some(
    role => role.name === ROLE_HDRUK_SUPERADMIN
    );
    if(!isSuperAdmin) {
        redirect(RouteName.ERROR_403);
    }

    return (<FeatureFlagsTable />);
}
