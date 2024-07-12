import Application from "./components/Application";

export const metadata = {
    title: "Health Data Research Innovation Gateway - DAR Application",
    description: "",
};

const ApplicationPage = async ({
    params,
}: {
    params: { applicationId: number };
}) => {
    return <Application applicationId={params.applicationId} />;
};

export default ApplicationPage;
