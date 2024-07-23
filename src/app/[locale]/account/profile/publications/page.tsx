import { cookies } from "next/headers";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import UserPublications from "./components/UserPublications";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Publications",
    description: "",
};

const UserPublicationsPage = async () => {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = getPermissions(user.roles);
    const userId = user?.id?.toString();

    return <UserPublications permissions={permissions} userId={userId} />;
};

export default UserPublicationsPage;
