"use client";

import { useEffect, useState, useMemo } from "react";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
    DarQuestion,
    DarHasQuestion,
    DarTemplate,
} from "@/interfaces/DataAccessRequest";
import { QuestionBankQuestion } from "@/interfaces/QuestionBankQuestion";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import { TaskItem } from "@/interfaces/TaskBoard";
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
import theme, { colors } from "@/config/theme";
import { ArrowBackIosNewIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import PreviewTemplate from "./PreviewTemplate";
import QuestionItem from "./QuestionItem";

const EDIT_TEMPLATE_TRANSLATION_PATH = "pages.account.team.dar.template.edit";
const SELECTED_BOARD_ID = "selectedQuestions";
const QB_BOARD_ID = "questionBank";

function countBySectionId(templateQuestions: DarHasQuestion[]) {
    return templateQuestions?.reduce<Record<number, number>>((acc, q) => {
        const id = q.section_id;
        acc[id] = (acc[id] ?? 0) + 1;
        return acc;
    }, {});
}

interface EditTemplateProps {
    teamId: string;
    templateId: string;
}

const EditTemplate = ({ teamId, templateId }: EditTemplateProps) => {
    const t = useTranslations(EDIT_TEMPLATE_TRANSLATION_PATH);
    const { user } = useAuth();
    const router = useRouter();

    const backHref = `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.DAR_TEMPLATES}`;

    const { data: sections, isLoading: isLoadingSections } = useGet<
        QuestionBankSection[]
    >(`${apis.dataAccessSectionV1Url}?per_page=-1`, { keepPreviousData: true });

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
            boardId: q.force_required ? SELECTED_BOARD_ID : boardId,
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
                    anchored: t.force_required,
                    task: t,
                    content: <QuestionItem task={t} setTasks={setTasks} />,
                })),
        }),
        [t, tasks]
    );

    const initalQuestionBankBoard = useMemo(
        () => ({
            id: QB_BOARD_ID,
            title: t("questionBank.title"),
            description: t("questionBank.description"),
            tasks: tasks
                .filter(t => t.boardId === QB_BOARD_ID)
                .sort((a, b) => a.order - b.order)
                .map(t => ({
                    id: t.id,
                    anchored: false,
                    task: t,
                    content: (
                        <QuestionItem key={t.id} task={t} setTasks={setTasks} />
                    ),
                })),
        }),
        [t, tasks]
    );

    useEffect(() => {
        setBoardSections([initialSelectBoard, initalQuestionBankBoard]);
    }, [initialSelectBoard, initalQuestionBankBoard, isLoading]);

    useEffect(() => {
        if (isLoading) return;
        const currentTasks = boardSections[0]?.tasks;
        const initialTasks = initialSelectBoard.tasks;

        // check if the selected tasks and their order have changed
        const tasksAreUnchanged =
            initialTasks.length === currentTasks?.length &&
            initialTasks.every((value: TaskItem, index: number) => {
                const currentTask = currentTasks[index];
                return value.id === currentTask.id;
            });

        const anyTaskChanged = currentTasks?.some(t => t.task?.hasChanged);
        setHasChanges(!tasksAreUnchanged || anyTaskChanged);
    }, [boardSections, isLoading]);

    const handleSaveChanges = async (isPublished: boolean) => {
        // first board is the select board
        const tasksInSection = boardSections[0]?.tasks.map(t => {
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
            published: isPublished ? 1 : 0,
            locked: false,
            questions: tasksInSection,
        };

        updateTemplateQuestions(templateId, payload).then(() =>
            mutateQuestions().then(() =>
                mutateTemplate().then(() => setHasChanges(false))
            )
        );
    };

    const handleChangeSection = (sectionId: number) => {
        if (!hasChanges) {
            setSectionId(sectionId);
        } else {
            showModal({
                invertCloseIconBehaviour: true,
                confirmText: "Save section changes",
                cancelText: "Discard section changes",
                title: "Are you sure you want to exit?",
                content:
                    "You have changes to your template that will not be saved automatically",
                onCancel: () => setSectionId(sectionId),
                onSuccess: () => {
                    handleSaveChanges(template?.published ?? false);
                    setSectionId(sectionId);
                },
            });
        }
    };

    const tabsList = useMemo(
        () =>
            tasks.length > 0 && [
                {
                    label: "Select Questions",
                    value: "select",
                    content: tasks.length > 0 && (
                        <TaskBoard
                            boardSections={boardSections}
                            setBoardSections={setBoardSections}
                            anchoredErrorCallback={anchoredErrorCallback}
                        />
                    ),
                },
                {
                    label: "Preview",
                    value: "preview",
                    content:
                        tasks.length > 0 ? (
                            <PreviewTemplate
                                questions={tasks
                                    .filter(
                                        t => t.boardId === SELECTED_BOARD_ID
                                    )
                                    .sort((a, b) => a.order - b.order)}
                            />
                        ) : (
                            <Loading />
                        ),
                },
            ],
        [boardSections, tasks]
    );

    const countsBySectionId = useMemo(
        () => template?.questions && countBySectionId(template.questions),
        [template?.questions]
    );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Container
            maxWidth={false}
            sx={{ minHeight: "1000px", p: 1, m: 1, mx: 0, pt: 0, mt: 0 }}>
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: theme.zIndex.appBar,
                    bgcolor: colors.grey,
                    borderBottom: 1,
                    borderColor: "divider",
                    py: 4,
                }}>
                <Container
                    maxWidth={false}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}>
                    <Typography variant="h2" sx={{ m: 0 }}>
                        {t("title")}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                            onClick={() => handleSaveChanges(false)}
                            color="secondary"
                            variant="outlined">
                            {t("saveDraft")}
                        </Button>
                        <Button onClick={() => handleSaveChanges(true)}>
                            {t("save")}
                        </Button>
                    </Box>
                </Container>
            </Box>
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
                    sectionCounts={countsBySectionId}
                />
                <Container maxWidth={false}>
                    <Paper sx={{ p: 2 }}>
                        <Button
                            onClick={() => router.push(backHref)}
                            variant="text"
                            startIcon={<ArrowBackIosNewIcon />}>
                            {t("backLinkText")}
                        </Button>

                        <Typography variant="h2" sx={{ mt: 2 }}>
                            {currentSection?.name}
                        </Typography>

                        <Typography>{currentSection?.description}</Typography>
                    </Paper>
                    {tabsList && currentSection?.parent_section && (
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
