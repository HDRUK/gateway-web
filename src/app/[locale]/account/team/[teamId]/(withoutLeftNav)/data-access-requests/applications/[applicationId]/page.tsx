import metaData, { noFollowRobots } from "@/utils/metadata";
import Application from "@/app/[locale]/account/(withoutLeftNav)/profile/data-access-requests/applications/[applicationId]/components/Application";

export const metadata = metaData(
    {
        title: "DAR Application",
        description: "",
    },
    noFollowRobots
);
const DarApplicationPage = async ({
    params,
}: {
    params: { applicationId: number };
}) => {
    return <Application applicationId={params.applicationId} />;
};

export default DarApplicationPage;
