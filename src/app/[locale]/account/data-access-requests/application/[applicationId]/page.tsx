import Application from "./components/Application";
import metaData, {noFollowRobots} from "@/utils/metdata";

export const metadata = metaData({
    title: "DAR Application",
    description: "",
}, noFollowRobots);
const ApplicationPage = async ({
    params,
}: {
    params: { applicationId: number };
}) => {
    return <Application applicationId={params.applicationId} />;
};

export default ApplicationPage;
