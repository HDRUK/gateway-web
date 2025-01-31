"use client";

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
import ApplicationSection from "./ApplicationSection";

interface ApplicationProps {
    applicationId: number;
}

const Application = ({ applicationId }: ApplicationProps) => {
    // note: this wont be needed when we setup JWT for DARAS
    const { user } = useAuth();

    const { data: sections } = useGet<QuestionBankSection[]>(
        `${apis.dataAccessSectionV1Url}`,
        { keepPreviousData: true }
    );

    const { data } = useGet<DarApplication>(
        `${apis.dataAccessApplicationV1Url}/${applicationId}`,
        {
            itemName: "DAR Application",
        }
    );

    const { data: userAnswers } = useGet<DarApplicationAnswer[]>(
        user
            ? `${apis.dataAccessApplicationV1Url}/${applicationId}/answers`
            : null,
        {
            itemName: "DAR Application",
        }
    );

    if (!(data && userAnswers && sections)) {
        return <Loading />;
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
