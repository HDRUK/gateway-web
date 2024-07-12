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
import ApplicationSection from "./ApplicationSection";

interface ApplicationProps {
    applicationId: number;
}

const Application = ({ applicationId }: ApplicationProps) => {
    // note: this wont be needed when we setup JWT for DARAS
    const { user } = useAuth();

    const { data: sections } = useGet<QuestionBankSection[]>(
        `${apis.questionBankV1Url}/sections`,
        { keepPreviousData: true }
    );

    const { data } = useGet<DarApplication>(
        `${apis.darasV1Url}/dar-applications/${applicationId}`,
        {
            itemName: "DAR Application",
        }
    );

    // temp measure to send user.id because JWT and authorisation is not availble for DARAS yet
    const { data: userAnswers } = useGet<DarApplicationAnswer[]>(
        user
            ? `${apis.darasV1Url}/dar-applications/${applicationId}/answers?user_id=${user?.id}`
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
            sections={sections}
        />
    );
};

export default Application;
