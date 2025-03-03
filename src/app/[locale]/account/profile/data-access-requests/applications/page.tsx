import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import metaData from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import Dashboard from "./components/Dashboard";

export const metadata = metaData({
    title: "Applications - My Account",
    description: "",
});

const DARApplicationsPage = async () => {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = getPermissions(user.roles);
    const userId = user?.id?.toString();

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={[
                "data-access-template.read",
                "data-access-applications.provider.read",
                "data-access-applications.review.read",
            ]}>
            <Dashboard userId={userId} />
        </ProtectedAccountRoute>
    );
};

export default DARApplicationsPage;
