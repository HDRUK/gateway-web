"use client";

import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { RouteName } from "@/consts/routeName";
import EditTemplate from "./components/EditTemplate";

const CreateFileTemplatePage = async ({
    params,
}: {
    params: Promise<{ teamId: string; templateId: string }>;
}) => {
    const router = useRouter();
    const { teamId, templateId } = await params;

    const backHref = `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.DAR_TEMPLATES}`;

    const onClick = () => {
        router.push(backHref);
    };

    return (
        <ProtectedAccountRoute loggedInOnly>
            <BackButton onClick={onClick} label="Back to DAR admin" />
            <EditTemplate templateId={templateId} teamId={teamId} />
        </ProtectedAccountRoute>
    );
};

export default CreateFileTemplatePage;
