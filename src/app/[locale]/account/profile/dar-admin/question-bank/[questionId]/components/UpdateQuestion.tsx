"use client";

import { useRouter } from "next/navigation";
import {
    QuestionBankQuestion,
    QuestionBankCreateUpdateQuestion,
} from "@/interfaces/QuestionBankQuestion";
import ErrorDisplay from "@/components/ErrorDisplay";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import apis from "@/config/apis";
import { RouteName } from "@/consts/routeName";
import EditQuestion from "../../components/EditQuestion";

const UpdateQuestion = ({ questionId }: { questionId: string }) => {
    const router = useRouter();

    const { data } = useGet<QuestionBankQuestion>(
        `${apis.questionBankV1Url}/${questionId}`,
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

    const onSubmit = async (payload: QuestionBankCreateUpdateQuestion) =>
        updateQuestion(questionId, payload).then(() => {
            router.push(
                `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DAR_ADMIN}/${RouteName.QUESTION_BANK_ADMIN}/${RouteName.LIST}`
            );
        });

    if (data?.locked) {
        return <ErrorDisplay variant={423} />;
    }

    return <EditQuestion onSubmit={onSubmit} question={data} />;
};

export default UpdateQuestion;
