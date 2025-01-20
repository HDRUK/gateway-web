import { useState } from "react";
import { Control, useFieldArray, UseFormWatch } from "react-hook-form";
import { IconButton, SxProps } from "@mui/material";
import { QuestionBankQuestionForm } from "@/interfaces/QuestionBankQuestion";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Paper from "@/components/Paper";
import TextField from "@/components/TextField";
import Typography from "@/components/Typography";
import { inputComponents } from "@/config/forms";
import { AddIcon, CloseIcon } from "@/consts/icons";
import NestedFieldArray from "./Nested";

interface SelectMultipleOptionProps {
    containerSx?: SxProps;
    control: Control;
    name: string;
    watch: UseFormWatch<QuestionBankQuestionForm>;
}

const SelectMultipleOptions = ({
    containerSx = {
        p: 2,
        m: 0,
    },
    control,
    name,
    watch,
}: SelectMultipleOptionProps) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    const handleAdd = () =>
        append({
            label: "",
            children: [
                {
                    title: "",
                    component: inputComponents.TextField,
                    guidance: "",
                    allow_guidance_override: false,
                    force_required: false,
                    validations: [],
                },
            ],
        });

    const handleRemove = (indexToRemove: number) => remove(indexToRemove);

    const [expanded, setExpanded] = useState<string | false>("panel1");
    const handleChange = (isExpanded: boolean, panel: string) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <BoxContainer>
            {fields.map((option, index) => (
                <Box
                    sx={{
                        p: 0,
                        m: 0,
                        ...containerSx,
                        mt: 0,
                    }}>
                    <Box
                        key={option.value}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            p: 0,
                            m: 0,
                        }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "center",
                                alignContents: "center",
                                gap: 2,
                                m: 0,
                                py: 0,
                                px: 1,
                                justifyContent: "space-between",
                                width: "100%",
                            }}>
                            <TextField
                                key={option.value}
                                control={control}
                                name={`${name}.${index}.label`}
                                label=""
                                sx={{
                                    backgroundColor: "white",
                                    minWidth: "350px",
                                }}
                                formControlSx={{
                                    marginBottom: 0,
                                }}
                                placeholder="Option label"
                            />

                            <IconButton
                                size="large"
                                onClick={() => handleRemove(index)}
                                sx={{ mt: 0 }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 0 }}>
                        <Paper>
                            <Accordion
                                key={option.label}
                                expanded={expanded === option.label}
                                heading={
                                    <Typography>
                                        Show nested questions
                                    </Typography>
                                }
                                onChange={(_, isExpanded) =>
                                    handleChange(isExpanded, option.label)
                                }
                                contents={
                                    <NestedFieldArray
                                        control={control}
                                        index={index}
                                        watch={watch}
                                    />
                                }
                                sx={{ m: 0, mb: 0, p: 0 }}
                            />
                        </Paper>
                    </Box>
                </Box>
            ))}

            <Box sx={{ p: 0, mb: 5, mt: 0 }}>
                <Button onClick={handleAdd} startIcon={<AddIcon />}>
                    Add option
                </Button>
            </Box>
        </BoxContainer>
    );
};

export default SelectMultipleOptions;
