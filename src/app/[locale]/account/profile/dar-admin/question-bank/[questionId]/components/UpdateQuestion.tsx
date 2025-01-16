"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    QuestionBankQuestion,
    QuestionBankCreateUpdateQuestion,
} from "@/interfaces/QuestionBankQuestion";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import apis from "@/config/apis";
import { RouteName } from "@/consts/routeName";
import EditQuestion from "../../components/EditQuestion";

const UpdateQuestion = ({ questionId }: { questionId: string }) => {
    const router = useRouter();

    const [isLocked, setIsLocked] = useState(false);

    const { data, isLoading } = useGet<QuestionBankQuestion>(
        `${apis.questionBankV1Url}/${questionId}/latest`,
        {
            keepPreviousData: false,
        }
    );

    const updateQuestion = usePatch<QuestionBankCreateUpdateQuestion>(
        `${apis.questionBankV1Url}`,
        {
            itemName: "Question Bank",
        }
    );

    const lockQuestion = usePatch(`${apis.questionBankV1Url}`, {
        subPath: "lock",
        successNotificationsOn: false,
    });

    useEffect(() => {
        if (!isLoading) {
            if (!data?.locked) {
                lockQuestion(questionId, {});
            } else {
                setIsLocked(true);
            }
        }
    }, [isLoading, data, questionId, lockQuestion]);

    const onSubmit = async (payload: QuestionBankCreateUpdateQuestion) =>
        updateQuestion(questionId, payload).then(() => {
            router.push(
                `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DAR_ADMIN}/${RouteName.QUESTION_BANK_ADMIN}/${RouteName.LIST}`
            );
        });

    // if (isLocked) {
    //     return <ErrorDisplay variant={423} />;
    // }

    return <EditQuestion onSubmit={onSubmit} question={data} />;
};

export default UpdateQuestion;
