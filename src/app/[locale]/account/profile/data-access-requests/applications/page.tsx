import { cookies } from "next/headers";
import Dashboard from "@/components/DarDashboard";
import apis from "@/config/apis";
import { getUser } from "@/utils/api";
import metaData from "@/utils/metadata";

export const metadata = metaData({
    title: "Applications - My Account",
    description: "",
});

const DARApplicationsPage = async () => {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const userId = user?.id?.toString();

    return (
        <Dashboard
            translationPath="pages.account.profile.dataAccessRequests.applications"
            darApiPath={`${apis.usersV1Url}/${userId}/dar/applications`}
        />
    );
};

export default DARApplicationsPage;
