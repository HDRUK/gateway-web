"use client";

import { useRouter } from "next/navigation";
import { QuestionBankCreateUpdateQuestion } from "@/interfaces/QuestionBankQuestion";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { RouteName } from "@/consts/routeName";
import EditQuestion from "../../components/EditQuestion";

const CreateQuestion = () => {
    const router = useRouter();

    const createQuestion = usePost<QuestionBankCreateUpdateQuestion>(
        `${apis.questionBankV1Url}/questions`,
        {
            itemName: "Question Bank",
        }
    );

    const onSubmit = async (payload: QuestionBankCreateUpdateQuestion) =>
        createQuestion(payload).then(() => {
            router.push(
                `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DAR_ADMIN}/${RouteName.QUESTION_BANK_ADMIN}/${RouteName.LIST}`
            );
        });

    return <EditQuestion onSubmit={onSubmit} />;
};
export default CreateQuestion;
