import DarDashboard from "@/components/DarDashboard";
import apis from "@/config/apis";
import { getUser } from "@/utils/api";
import metaData from "@/utils/metadata";

export const metadata = metaData({
    title: "Applications - My Account",
    description: "",
});

const DARApplicationsPage = async () => {
    const user = await getUser();
    const userId = user?.id?.toString();

    return (
        <DarDashboard
            translationPath="pages.account.profile.dataAccessRequests.applications"
            darApiPath={`${apis.usersV1Url}/${userId}/dar/applications`}
            isResearcher
            userId={userId}
        />
    );
};

export default DARApplicationsPage;
