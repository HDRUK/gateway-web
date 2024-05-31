"use client";

import BackButton from "@/components/BackButton";
import EditTemplate from "../components/EditTemplate";

const EditTemplatePage = ({ params }: { params: { templateId: string } }) => {
    return (
        <>
            <BackButton label="Back to DAR admin" />
            <EditTemplate templateId={params.templateId} />
        </>
    );
};

export default EditTemplatePage;
