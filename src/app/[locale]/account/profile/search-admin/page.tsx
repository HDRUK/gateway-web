import { redirect } from "next/navigation";
import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { RouteName } from "@/consts/routeName";
import { ROLE_HDRUK_SUPERADMIN } from "@/consts/roles";
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
    const isSuperAdmin = user.roles.some(
        role => role.name === ROLE_HDRUK_SUPERADMIN
    );

    if (!isSuperAdmin) {
        redirect(RouteName.ERROR_403);
    }

    return <SearchAdminPanel />;
}
