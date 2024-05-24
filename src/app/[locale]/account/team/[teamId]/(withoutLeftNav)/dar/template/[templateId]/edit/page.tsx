"use client";

import { useParams } from "next/navigation";
import BackButton from "@/components/BackButton";
import EditTemplate from "../components/EditTemplate";

const EditTemplatePage = () => {
    const { teamId, templateId } = useParams<{
        teamId: string;
        templateId: string;
    }>();

    return (
        <>
            <BackButton label="Back to DAR admin" />
            <EditTemplate templateId={templateId} />
        </>
    );
};

export default EditTemplatePage;
