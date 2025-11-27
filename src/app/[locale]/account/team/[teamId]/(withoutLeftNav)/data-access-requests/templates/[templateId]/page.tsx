import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import EditTemplate from "./components/EditTemplate";

const EditTemplatePage = async ({
    params,
}: {
    params: Promise<{ teamId: string; templateId: string }>;
}) => {
    const { teamId, templateId } = await params;
    return (
        <ProtectedAccountRoute loggedInOnly>
            <EditTemplate templateId={templateId} teamId={teamId} />
        </ProtectedAccountRoute>
    );
};

export default EditTemplatePage;
