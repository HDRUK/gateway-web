import metaData, { noFollowRobots } from "@/utils/metadata";
import Application from "./components/Application";

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
