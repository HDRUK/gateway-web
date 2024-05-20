"use client";

import { v4 as uuidv4 } from "uuid";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import useGet from "@/hooks/useGet";
import { Task } from "../components";
import BoardSectionList from "../components/BoardSectionList";

const TestPage = () => {
    const team_id = 10;

    const { data: templateQuestions, isLoading } = useGet(
        `http://localhost:3003/dar-templates?team_id=${team_id}`,
        { keepPreviousData: true }
    );

    const { data: qbQuestions, isLoading: isLoadingQB } = useGet(
        `http://localhost:3333/questions`,
        { keepPreviousData: true }
    );

    if (isLoading || isLoadingQB) {
        return (
            <>
                <Loading />
            </>
        );
    }

    const initalTemplateQuestions: Task[] =
        templateQuestions?.questions?.map(q => {
            return {
                //id: uuidv4(),
                id: q.question_id,
                title: `${q.question_id}) ${q.latest_version.title}`,
                description: q.guidance
                    ? q.guidance
                    : q.latest_version.guidance,
                status: "Selected Questions",
            };
        }) || [];

    const initialQuestionBankQuestions: Task[] = qbQuestions
        ?.map(q => {
            const { title, guidance } = JSON.parse(q.question_json);

            return {
                id: q.id,
                title: `${q.id}) ${title} `,
                description: guidance,
                status: "Question Bank",
            };
        })
        .filter(
            question =>
                !initalTemplateQuestions.some(
                    templateQuestion => templateQuestion.id === question.id
                )
        );

    const tasks: Task[] = [
        ...initalTemplateQuestions,
        ...initialQuestionBankQuestions,
    ];

    return (
        <>
            <BoardSectionList tasks={tasks} />
        </>
    );
};

export default TestPage;
