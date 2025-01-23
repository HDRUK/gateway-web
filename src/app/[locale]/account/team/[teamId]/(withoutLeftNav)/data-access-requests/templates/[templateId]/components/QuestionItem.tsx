import { useEffect, useState, useMemo, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { DarQuestion } from "@/interfaces/DataAccessRequest";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Chip from "@/components/Chip";
import RadioGroup from "@/components/RadioGroup";
import TextArea from "@/components/TextArea";
import TooltipIcon from "@/components/TooltipIcon";
import useModal from "@/hooks/useModal";
import {
    DragIndicatorIcon,
    EditIcon,
    LockIcon,
    RestartAltIcon,
} from "@/consts/icons";

const EDIT_TEMPLATE_TRANSLATION_PATH = "pages.account.team.dar.template.edit";

type QuestionItemProps = {
    task: DarQuestion;
    setTasks: Dispatch<SetStateAction<DarQuestion[]>>;
};

const QuestionItem = ({ task, setTasks }: QuestionItemProps) => {
    const t = useTranslations(EDIT_TEMPLATE_TRANSLATION_PATH);
    const { showModal } = useModal();

    const [currentTask, setCurrentTask] = useState(task);
    useEffect(() => {
        setCurrentTask(task);
    }, [task]);

    const { control, getValues, setValue, handleSubmit } = useForm({
        defaultValues: {
            guidance: currentTask.guidance,
            required: currentTask.required,
        },
    });

    const allowEditRequired = useMemo(
        () => !currentTask.force_required,
        [currentTask]
    );
    const allowEditGuidance = useMemo(
        () => currentTask.allow_guidance_override,
        [currentTask]
    );
    const allowEdit = useMemo(
        () => allowEditRequired || allowEditGuidance,
        [allowEditRequired, allowEditGuidance]
    );

    const onSuccess = async () => {
        const guidance = getValues("guidance");
        const required = getValues("required");

        const updatedTask = {
            ...task,
            guidance,
            required:
                typeof required === "string"
                    ? parseInt(required, 10)
                    : required,
            hasChanged: true,
        };

        setTasks(prevTasks =>
            prevTasks.map(t => (t.id === updatedTask.id ? updatedTask : t))
        );
    };

    const handleEdit = () => {
        const resetGuidance = () => {
            setValue("guidance", currentTask.original_guidance);
        };

        showModal({
            confirmText: "Done",
            cancelText: "Cancel",
            title: "Customise Question",
            content: (
                <Box>
                    <BoxContainer
                        sx={{
                            gridTemplateColumns: {
                                tablet: "10fr 1fr",
                            },
                            gap: {
                                mobile: 1,
                                tablet: 2,
                            },
                            p: 0,
                        }}>
                        <TextArea
                            disabled={!allowEditGuidance}
                            label="Guidance"
                            name="guidance"
                            control={control}
                        />
                        <Box
                            sx={{
                                p: 0,
                                m: 0,
                                display: "flex",
                                alignItems: "center",
                            }}>
                            <IconButton
                                sx={{ p: 0, m: 0 }}
                                onClick={resetGuidance}>
                                <RestartAltIcon />
                            </IconButton>
                        </Box>
                    </BoxContainer>

                    <RadioGroup
                        isRow
                        disabled={!allowEditRequired}
                        name="required"
                        label="Required"
                        control={control}
                        radios={[
                            { value: 1, label: "Required" },
                            { value: 0, label: "Not Required" },
                        ]}
                    />
                </Box>
            ),
            onSuccess: handleSubmit(onSuccess),
        });
    };

    const showLock = useMemo(() => !!currentTask.required, [currentTask]);

    return (
        <Card
            sx={{
                border: 1,
                borderColor: !allowEditRequired ? "red" : "lightgrey",
                borderRadius: 2,
            }}>
            <CardContent
                sx={{
                    p: 0,
                    m: 0,
                    alignItems: "center",
                    "&:last-child": {
                        pb: 0,
                    },
                }}>
                <Box sx={{ width: "100%" }}>
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "space-between",
                            p: 0,
                            m: 0,
                        }}>
                        <Typography
                            gutterBottom
                            variant="h4"
                            component="div"
                            sx={{ mb: 1, fontWeight: "bold" }}>
                            {currentTask.title}
                        </Typography>

                        <Box
                            sx={{
                                p: 0,
                                m: 0,
                                display: "flex",
                                alignItems: "top",
                            }}>
                            <IconButton
                                sx={{ p: 0, m: 0, alignSelf: "flex-start" }}
                                disabled={!allowEdit}
                                onClick={() => handleEdit()}>
                                <EditIcon
                                    color={allowEdit ? "primary" : "grey"}
                                />
                            </IconButton>

                            <DragIndicatorIcon
                                sx={{ cursor: "grab" }}
                                fontSize="medium"
                                color="primary"
                            />
                        </Box>
                    </Box>
                    <Typography
                        sx={{ p: 1, pl: 0 }}
                        gutterBottom
                        variant="h5"
                        component="p">
                        {currentTask.guidance}
                    </Typography>
                    <Typography>
                        <Chip
                            variant="outlined"
                            label={currentTask.component}
                            color="primary"
                        />
                    </Typography>

                    <Box sx={{ mt: 2, p: 0 }}>
                        {currentTask?.options?.map(option => (
                            <Accordion
                                key={option.label}
                                heading={
                                    <Typography>
                                        {t("parentQuestionOption")}: (
                                        {option.label})
                                    </Typography>
                                }
                                contents={
                                    option?.children.length ? (
                                        <>
                                            {option?.children?.map(child => (
                                                <Box>
                                                    <Typography
                                                        gutterBottom
                                                        variant="h4"
                                                        component="p"
                                                        sx={{ mb: 1 }}>
                                                        <b>{child.title}</b>
                                                    </Typography>
                                                    <Typography
                                                        sx={{ p: 1, pl: 0 }}
                                                        gutterBottom
                                                        variant="h5"
                                                        component="p">
                                                        {child.guidance}
                                                    </Typography>

                                                    <Typography>
                                                        <Chip
                                                            variant="outlined"
                                                            label={
                                                                child.component
                                                            }
                                                            color="primary"
                                                        />
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </>
                                    ) : (
                                        <Typography>
                                            {t("noNestedQuestions")}
                                        </Typography>
                                    )
                                }
                            />
                        ))}
                    </Box>
                </Box>
            </CardContent>
            {showLock && (
                <TooltipIcon
                    content={<div>{t("forcedRequired")}</div>}
                    icon={<LockIcon sx={{ color: "grey" }} />}
                    label=""
                />
            )}
        </Card>
    );
};

export default QuestionItem;
