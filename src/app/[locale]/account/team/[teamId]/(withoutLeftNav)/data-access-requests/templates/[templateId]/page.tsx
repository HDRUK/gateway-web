import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import EditTemplate from "./components/EditTemplate";

const EditTemplatePage = ({
    params,
}: {
    params: { teamId: string; templateId: string };
}) => {
    return (
        <ProtectedAccountRoute loggedInOnly>
            <EditTemplate
                templateId={params.templateId}
                teamId={params.teamId}
            />
        </ProtectedAccountRoute>
    );
};

export default EditTemplatePage;
