import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { DarQuestion } from "@/interfaces/DataAccessRequest";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
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

type QuestionItemProps = {
    task: DarQuestion;
    setTasks: Dispatch<SetStateAction<DarQuestion[]>>;
};

const QuestionItem = ({ task, setTasks }: QuestionItemProps) => {
    const { showModal } = useModal();

    const [currentTask, setCurrentTask] = useState(task);
    useEffect(() => {
        setCurrentTask(task);
    }, [task]);

    const { control, getValues, setValue } = useForm({
        defaultValues: {
            guidance: currentTask.guidance,
            required: currentTask.required,
        },
    });

    const allow_edit_required = currentTask.force_required === 0;
    const allow_edit_guidance = currentTask.allow_guidance_override === 1;
    const allowEdit = allow_edit_required || allow_edit_guidance;

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
                            disabled={!allow_edit_guidance}
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
                        disabled={!allow_edit_required}
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
            onSuccess: async () => {
                const guidance = getValues("guidance");
                const required = getValues("required");

                const updatedTask = {
                    ...task,
                    guidance,
                    required,
                    hasChanged: true,
                };

                setTasks(prevTasks =>
                    prevTasks.map(t =>
                        t.id === updatedTask.id ? updatedTask : t
                    )
                );
            },
        });
    };

    return (
        <Card
            sx={{
                border: 1,
                borderColor: "lightgrey",
                borderRadius: 2,
            }}>
            <CardContent sx={{ p: 0, m: 0, alignItems: "center" }}>
                <Box sx={{ p: 1, m: 1, ml: 0, width: "100%" }}>
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
                            sx={{ mb: 1 }}>
                            <b> {currentTask.title} </b>
                        </Typography>
                        <Box
                            sx={{
                                p: 0,
                                m: 0,
                                display: "flex",
                                alignItems: "top",
                            }}>
                            <IconButton
                                sx={{ p: 0, m: 0 }}
                                disabled={!allowEdit}
                                onClick={() => handleEdit()}>
                                <EditIcon
                                    sx={{
                                        color: allowEdit ? "primary" : "grey",
                                    }}
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
                        sx={{ p: 1 }}
                        gutterBottom
                        variant="h5"
                        component="div">
                        {currentTask.guidance}
                    </Typography>
                </Box>
            </CardContent>
            {!allow_edit_required && (
                <TooltipIcon
                    content={<div>required question</div>}
                    icon={<LockIcon sx={{ color: "red" }} />}
                    label=""
                />
            )}
        </Card>
    );
};

export default QuestionItem;
