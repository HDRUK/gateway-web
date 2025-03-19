"use client";

import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { RouteName } from "@/consts/routeName";
import EditTemplate from "./components/EditTemplate";

const EditTemplatePage = ({
    params,
}: {
    params: { teamId: string; templateId: string };
}) => {
    const router = useRouter();

    const backHref = `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params.teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.DAR_TEMPLATES}`;

    const onClick = () => {
        router.push(backHref);
    };

    return (
        <>
            <BackButton onClick={onClick} label="Back to DAR admin" />
            <EditTemplate
                templateId={params.templateId}
                teamId={params.teamId}
            />
        </>
    );
};

export default EditTemplatePage;
