import BackButton from "@/components/BackButton";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import EditTemplate from "./components/EditTemplate";

const CreateFileTemplatePage = async ({
    params,
}: {
    params: Promise<{ teamId: string; templateId: string }>;
}) => {
    const { teamId } = await params;

    return (
        <ProtectedAccountRoute loggedInOnly>
            <BackButton label="Back to DAR admin" />
            <EditTemplate teamId={teamId} />
        </ProtectedAccountRoute>
    );
};

export default CreateFileTemplatePage;
