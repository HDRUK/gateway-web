import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { DarTemplateType } from "@/consts/dataAccess";
import { getDarTemplate } from "@/utils/api";
import notFound from "@/app/not-found";
import EditDocumentTemplate from "./components/EditDocumentTemplate";
import EditTemplate from "./components/EditTemplate";

const EditTemplatePage = async ({
    params,
}: {
    params: Promise<{ teamId: string; templateId: string }>;
}) => {
    const { teamId, templateId } = await params;

    const darTemplateData = await getDarTemplate(templateId, {
        suppressError: true,
    });

    if (!darTemplateData) {
        notFound();
    }

    return (
        <ProtectedAccountRoute loggedInOnly>
            {darTemplateData.template_type === DarTemplateType.FORM ? (
                <EditTemplate
                    templateId={templateId}
                    teamId={teamId}
                    darTemplateData={darTemplateData}
                />
            ) : (
                <EditDocumentTemplate
                    templateId={templateId}
                    teamId={teamId}
                    darTemplateData={darTemplateData}
                />
            )}
        </ProtectedAccountRoute>
    );
};

export default EditTemplatePage;
