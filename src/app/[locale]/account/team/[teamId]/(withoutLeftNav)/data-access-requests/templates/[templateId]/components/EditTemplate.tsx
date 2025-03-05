"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
    DarQuestion,
    DarHasQuestion,
    DarTemplate,
} from "@/interfaces/DataAccessRequest";
import { QuestionBankQuestion } from "@/interfaces/QuestionBankQuestion";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import { TaskItem } from "@/interfaces/TaskBoard";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Sections from "@/components/Sections";
import Tabs from "@/components/Tabs";
import TaskBoard from "@/components/TaskBoard";
import { TaskBoardSectionProps } from "@/components/TaskBoardSection/TaskBoardSection";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import useGet from "@/hooks/useGet";
import useModal from "@/hooks/useModal";
import usePatch from "@/hooks/usePatch";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import PreviewTemplate from "./PreviewTemplate";
import QuestionItem from "./QuestionItem";

const EDIT_TEMPLATE_TRANSLATION_PATH = "pages.account.team.dar.template.edit";

const SELECTED_BOARD_ID = "selectedQuestions";
const QB_BOARD_ID = "questionBank";

interface EditTemplateProps {
    teamId: string;
    templateId: string;
}

const EditTemplate = ({ teamId, templateId }: EditTemplateProps) => {
    const t = useTranslations(EDIT_TEMPLATE_TRANSLATION_PATH);
    const { user } = useAuth();

    const { data: sections, isLoading: isLoadingSections } = useGet<
        QuestionBankSection[]
    >(`${apis.dataAccessSectionV1Url}`, { keepPreviousData: true });

    const {
        data: template,
        isLoading: isLoadingQuestions,
        mutate: mutateTemplate,
    } = useGet<DarTemplate>(`${apis.dataAccessTemplateV1Url}/${templateId}`, {
        keepPreviousData: true,
    });

    const [sectionId, setSectionId] = useState(1);
    const [boardSections, setBoardSections] = useState<TaskBoardSectionProps[]>(
        []
    );

    const {
        data: qbQuestions,
        isLoading: isLoadingQB,
        mutate: mutateQuestions,
    } = useGet<QuestionBankQuestion>(
        `${apis.apiV1Url}/teams/${teamId}/questions/section/${sectionId}?is_child=0`,
        {
            keepPreviousData: true,
        }
    );

    const isLoading = isLoadingQuestions || isLoadingQB || isLoadingSections;

    const updateTemplateQuestions = usePatch(apis.dataAccessTemplateV1Url, {
        itemName: "Update Template",
        query: `section_id=${sectionId}`,
    });

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
        boardId: string,
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
            ...q,
            id: q.question_id,
            boardId,
            order: extended ? q.order : index,
            guidance:
                extended && q.allow_guidance_override && q.guidance
                    ? q.guidance
                    : q.guidance || "",
            original_guidance: q.guidance || "",
            hasChanged: false,
        };
    };

    const [tasks, setTasks] = useState<DarQuestion[]>([]);

    useEffect(() => {
        if (isLoading) return;

        const templateQuestionIds = template?.questions.map(q => q.question_id);

        const foundTasks =
            qbQuestions
                ?.filter(q => q.section_id === sectionId)
                ?.map((qbQuestion, index) => {
                    const selected =
                        templateQuestionIds?.includes(qbQuestion.question_id) ??
                        false;
                    let templateQuestion;
                    if (selected) {
                        templateQuestion = template?.questions.find(
                            tq => tq.question_id === qbQuestion.question_id
                        );
                    }
                    const question = {
                        ...qbQuestion,
                        ...templateQuestion,
                    };
                    const boardId = selected ? SELECTED_BOARD_ID : QB_BOARD_ID;

                    return makeTask(question, boardId, index);
                }) || [];
        setTasks(foundTasks);
    }, [sectionId, qbQuestions, template, isLoading]);

    const initialSelectBoard = useMemo(
        () => ({
            id: SELECTED_BOARD_ID,
            title: t("selectedQuestions.title"),
            description: t("selectedQuestions.description"),
            tasks: tasks
                .filter(t => t.boardId === SELECTED_BOARD_ID)
                .sort((a, b) => a.order - b.order)
                .map(t => ({
                    id: t.id,
                    anchored: t.force_required === 1,
                    task: t,
                    content: <QuestionItem task={t} setTasks={setTasks} />,
                })),
        }),
        [tasks, isLoading]
    );

    const initalQuestionBankBoard = useMemo(
        () => ({
            id: QB_BOARD_ID,
            title: t("questionBank.title"),
            description: t("questionBank.description"),
            tasks: tasks
                .filter(t => t.boardId === QB_BOARD_ID)
                .sort((a, b) => a.order - b.order)
                .map(t => {
                    return {
                        id: t.id,
                        anchored: false,
                        task: t,
                        content: (
                            <QuestionItem
                                key={t.id}
                                task={t}
                                setTasks={setTasks}
                            />
                        ),
                    };
                }),
        }),
        [tasks, isLoading]
    );

    useEffect(() => {
        setBoardSections([initialSelectBoard, initalQuestionBankBoard]);
    }, [initialSelectBoard, initalQuestionBankBoard, isLoading]);

    useEffect(() => {
        if (isLoading) return;
        const currentTasks = boardSections[0].tasks;
        const initialTasks = initialSelectBoard.tasks;

        // check if the selected tasks and their order have changed
        const tasksAreUnchanged =
            initialTasks.length === currentTasks.length &&
            initialTasks.every((value: TaskItem, index: number) => {
                const currentTask = currentTasks[index];
                return value.id === currentTask.id;
            });

        const anyTaskChanged = currentTasks.some(t => t.task?.hasChanged);
        setHasChanges(!tasksAreUnchanged || anyTaskChanged);
    }, [boardSections, isLoading]);

    const handleSaveChanges = () => {
        // first board is the select board
        const tasksInSection = boardSections[0].tasks.map(t => {
            return {
                id: t.id,
                guidance: t.task?.guidance,
                required: t.task?.required,
                order: t.task?.order,
            };
        });

        const payload = {
            team_id: teamId,
            user_id: user?.id.toString(),
            published: 1,
            locked: false,
            questions: tasksInSection,
        };
        updateTemplateQuestions(templateId, payload).then(() =>
            mutateQuestions().then(() =>
                mutateTemplate().then(() => setHasChanges(false))
            )
        );
    };

    const tabsList = tasks.length > 0 && [
        {
            label: "Select Questions",
            value: "select",
            content: tasks.length > 0 && (
                <>
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
                                {t("save")}
                            </Button>
                        </Box>
                    </Paper>
                </>
            ),
        },
        {
            label: "Preview",
            value: "preview",
            content:
                tasks.length > 0 ? (
                    <PreviewTemplate
                        questions={tasks
                            .filter(t => t.boardId === SELECTED_BOARD_ID)
                            .sort((a, b) => a.order - b.order)}
                    />
                ) : (
                    <Loading />
                ),
        },
    ];

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Container maxWidth={false} sx={{ minHeight: "1000px", p: 1, m: 1 }}>
            <Typography variant="h2"> {t("title")} </Typography>
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
                            {currentSection?.name}
                        </Typography>

                        <Typography>{currentSection?.description}</Typography>
                    </Paper>
                    {tabsList && (
                        <Tabs
                            centered
                            tabs={tabsList}
                            tabBoxSx={{ padding: 0 }}
                            rootBoxSx={{ padding: 0 }}
                        />
                    )}
                </Container>
            </Container>
        </Container>
    );
};

export default EditTemplate;
