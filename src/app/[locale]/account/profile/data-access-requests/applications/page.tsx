import { cookies } from "next/headers";
import Dashboard from "@/components/DarDashboard";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import apis from "@/config/apis";
import { getUser } from "@/utils/api";
import metaData from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";

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
            <Dashboard
                translationPath="pages.account.profile.dataAccessRequests.applications"
                darApiPath={`${apis.usersV1Url}/${userId}/dar/applications`}
            />
        </ProtectedAccountRoute>
    );
};

export default DARApplicationsPage;
