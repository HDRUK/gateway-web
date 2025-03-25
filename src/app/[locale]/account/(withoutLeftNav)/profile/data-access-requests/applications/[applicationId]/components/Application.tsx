"use client";

import { useParams } from "next/navigation";
import {
    DarApplication,
    DarApplicationAnswer,
} from "@/interfaces/DataAccessRequest";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import Loading from "@/components/Loading";
import useAuth from "@/hooks/useAuth";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { beforeYouBeginSection } from "@/config/forms/dataAccessApplication";
import notFound from "@/app/not-found";
import ApplicationSection from "./ApplicationSection";

interface ApplicationProps {
    applicationId: number;
}

const Application = ({ applicationId }: ApplicationProps) => {
    const params = useParams<{
        teamId: string;
    }>();

    // note: this wont be needed when we setup JWT for DARAS
    const { user } = useAuth();

    const isResearcher = !params?.teamId;

    const { data: sections } = useGet<QuestionBankSection[]>(
        `${apis.dataAccessSectionV1Url}`,
        { keepPreviousData: true }
    );

    const darApplicationEndpoint = isResearcher
        ? `${apis.usersV1Url}/${user?.id}/dar/applications/${applicationId}`
        : `${apis.teamsV1Url}/${params?.teamId}/dar/applications/${applicationId}`;

    const { data, isLoading } = useGet<DarApplication>(darApplicationEndpoint, {
        itemName: "DAR Application",
        shouldFetch: !!user?.id || !!params?.teamId,
        errorNotificationsOn: false,
    });

    const { data: userAnswers } = useGet<DarApplicationAnswer[]>(
        user ? `${darApplicationEndpoint}/answers` : null,
        {
            itemName: "DAR Application",
            shouldFetch: !!user?.id || !!params?.teamId,
            errorNotificationsOn: false,
        }
    );

    if (!(data && userAnswers && sections)) {
        return <Loading />;
    }

    if (!data && !isLoading) {
        notFound();
    }

    return (
        <ApplicationSection
            applicationId={applicationId}
            data={data}
            userAnswers={userAnswers}
            sections={[beforeYouBeginSection, ...sections]}
        />
    );
};

export default Application;
