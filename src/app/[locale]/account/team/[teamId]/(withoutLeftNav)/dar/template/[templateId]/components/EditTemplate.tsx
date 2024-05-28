"use client";

import { useEffect, useState, useMemo } from "react";
import {
    DarQuestion,
    DarHasQuestion,
    DarTemplate,
} from "@/interfaces/DataAccessRequest";
import { PaginationType } from "@/interfaces/Pagination";
import { QuestionBankQuestion } from "@/interfaces/QuestionBankQuestion";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import TaskBoard from "@/components/TaskBoard";
import { TaskBoardSectionProps } from "@/components/TaskBoardSection/TaskBoardSection";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import useModal from "@/hooks/useModal";
import usePatch from "@/hooks/usePatch";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import QuestionItem from "./QuestionItem";
import Sections from "./Sections";

interface EditTemplateProps {
    templateId: string;
}

const EditTemplate = ({ templateId }: EditTemplateProps) => {
    const { data: sections, isLoading: isLoadingSections } = useGet<
        QuestionBankSection[]
    >(`${apis.questionBankV1Url}/sections`, { keepPreviousData: true });

    const {
        data: template,
        isLoading: isLoadingQuestions,
        mutate: mutateTemplate,
    } = useGet<DarTemplate>(`${apis.darasV1Url}/dar-templates/${templateId}`, {
        keepPreviousData: true,
    });

    const {
        data: qbQuestions,
        isLoading: isLoadingQB,
        mutate: mutateQuestions,
    } = useGet<PaginationType<QuestionBankQuestion>>(
        `${apis.questionBankV1Url}/questions`,
        {
            keepPreviousData: true,
        }
    );

    const isLoading = isLoadingQuestions || isLoadingQB || isLoadingSections;

    const [sectionId, setSectionId] = useState(1);
    const [boardSections, setBoardSections] = useState<TaskBoardSectionProps[]>(
        []
    );

    const updateTemplateQuestions = usePatch(
        `${apis.darasV1Url}/dar-templates`,
        {
            itemName: "Update Template",
            query: `section_id=${sectionId}`,
        }
    );

    const [hasChanges, setHasChanges] = useState(false);

    const { showModal } = useModal();

    const anchoredErrorCallback = () => {
        notificationService.error(
            "Question is forced to be required and cannot be deselected",
            {
                persist: false,
            }
        );
    };

    const handleChangeSection = (sectionId: number) => {
        if (!hasChanges) {
            setSectionId(sectionId);
        } else {
            showModal({
                invertCloseIconBehaviour: true,
                confirmText: "Stay on page",
                cancelText: "Continue without saving",
                title: "Are you sure you want to exit?",
                content:
                    "You have changes to your template that will not be saved automatically",
                onCancel: () => setSectionId(sectionId),
            });
        }
    };

    const [currentSection, setCurrentSection] = useState<QuestionBankSection>();

    useEffect(() => {
        const section = sections?.filter(s => s.id === sectionId)[0];
        if (section) {
            setCurrentSection(section);
        }
    }, [sections, sectionId]);

    const makeTask = (
        q: QuestionBankQuestion | (QuestionBankQuestion & DarHasQuestion),
        selected: boolean,
        index: number
    ): DarQuestion => {
        const isExtendedQuestion = (
            q: QuestionBankQuestion | (QuestionBankQuestion & DarHasQuestion)
        ): q is QuestionBankQuestion & DarHasQuestion => {
            return (
                (q as QuestionBankQuestion & DarHasQuestion).order !== undefined
            );
        };

        const extended = isExtendedQuestion(q);

        return {
            id: q.id,
            order: extended ? q.order : index,
            selected,
            title: `${q.id}) ${q.question_json.title} `,
            guidance:
                extended && q.allow_guidance_override
                    ? q.guidance
                    : q.question_json.guidance || "",
            original_guidance: q.question_json.guidance || "",
            required: q.required,
            force_required: q.force_required,
            allow_guidance_override: q.allow_guidance_override,
            hasChanged: false,
        };
    };

    const [tasks, setTasks] = useState<DarQuestion[]>([]);
    useEffect(() => {
        if (isLoading) return;

        const templateQuestionIds = template?.questions.map(q => q.question_id);

        setTasks(
            qbQuestions?.list
                ?.filter(q => q.section_id === sectionId)
                ?.map((qbQuestion, index) => {
                    const selected =
                        templateQuestionIds?.includes(qbQuestion.id) ?? false;
                    let templateQuestion;
                    if (selected) {
                        templateQuestion = template?.questions.find(
                            tq => tq.question_id === qbQuestion.id
                        );
                    }
                    // stitch together the qbQuestion and DarTemplateHasQuestion
                    const question = {
                        ...qbQuestion,
                        ...templateQuestion,
                    };
                    return makeTask(question, selected, index);
                }) || []
        );
    }, [sectionId, qbQuestions, template]);

    const initialSelectBoard = useMemo(
        () => ({
            id: "selectQuestions",
            title: "Selected Questions",
            description: "Currently selected questions for your DAR template.",
            tasks: tasks
                .filter(t => t.selected)
                .sort((a, b) => a.order - b.order)
                .map(t => ({
                    id: t.id,
                    anchored: t.force_required === 1,
                    task: t,
                    content: <QuestionItem task={t} setTasks={setTasks} />,
                })),
        }),
        [tasks]
    );

    const initalQuestionBankBoard = useMemo(
        () => ({
            id: "questionBank",
            description:
                "Other available questions you can add from the question bank.",
            title: "Question Bank",
            tasks: tasks
                .filter(t => !t.selected)
                .sort((a, b) => a.order - b.order)
                .map(t => {
                    return {
                        id: t.id,
                        anchored: false,
                        task: t,
                        content: <QuestionItem task={t} setTasks={setTasks} />,
                    };
                }),
        }),
        [tasks]
    );

    useEffect(() => {
        setBoardSections([initialSelectBoard, initalQuestionBankBoard]);
    }, [initialSelectBoard, initalQuestionBankBoard]);

    useEffect(() => {
        if (isLoading) return;
        const currentTasks = boardSections[0].tasks;
        const initialTasks = initialSelectBoard.tasks;

        // check if the selected tasks and their order have changed
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const tasksAreUnchanged =
            initialTasks.length === currentTasks.length &&
            initialTasks.every((value: any, index: number) => {
                const currentTask = currentTasks[index];
                return value.id === currentTask.id;
            });

        const anyTaskChanged = currentTasks.some(t => t.task.hasChanged);
        setHasChanges(!tasksAreUnchanged || anyTaskChanged);
    }, [boardSections]);

    const handleSaveChanges = () => {
        // first board is the select board
        const tasksInSection = boardSections[0].tasks.map(t => t.task);
        const payload = { questions: tasksInSection };
        updateTemplateQuestions(templateId, payload).then(() =>
            mutateQuestions().then(() =>
                mutateTemplate().then(() => setHasChanges(false))
            )
        );
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Container maxWidth={false} sx={{ minHeight: "1000px", p: 1, m: 1 }}>
            <Typography variant="h2"> Edit a template </Typography>
            <Container
                maxWidth={false}
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 4fr",
                    gap: 0,
                    pt: 2,
                }}>
                <Sections
                    handleLegendClick={handleChangeSection}
                    sectionId={sectionId}
                    sections={sections || []}
                />
                <Container maxWidth={false}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h2">
                            {currentSection?.name}{" "}
                        </Typography>
                    </Paper>
                    <TaskBoard
                        boardSections={boardSections}
                        setBoardSections={setBoardSections}
                        anchoredErrorCallback={anchoredErrorCallback}
                    />
                    <Paper sx={{ m: 2, p: 2, mb: 5 }}>
                        <Box
                            sx={{
                                p: 0,
                                display: "flex",
                                justifyContent: "end",
                            }}>
                            <Button onClick={handleSaveChanges} type="submit">
                                Save changes
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Container>
        </Container>
    );
};

export default EditTemplate;
