import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import FeatureFlagsTable from "./FeatureFlagsTable";
import { redirect } from "next/navigation";
import { RouteName } from "@/consts/routeName";

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
    role => role.name === 'hdruk.superadmin'
    );
    if(!isSuperAdmin) {
        redirect(RouteName.ERROR_403);
    }

    return (<FeatureFlagsTable />);
}
