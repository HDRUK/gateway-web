import { redirect } from "next/navigation";
import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { isSuperAdmin } from "@/utils/permissions";
import { RouteName } from "@/consts/routeName";
import SearchAdminPanel from "./SearchAdminPanel";

export const metadata = metaData(
    {
        title: "Admin Panel",
        description: "",
    },
    noFollowRobots
);

export default async function SearchAdminPage() {
    const user = await getUser();

    if (!isSuperAdmin(user.roles)) {
        redirect(RouteName.ERROR_403);
    }

    return <SearchAdminPanel />;
}
