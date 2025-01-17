import { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { SxProps } from "@mui/material";
import { inputComponents } from "@/config/forms";
import { AddIcon, RemoveIcon } from "@/consts/icons";
import Accordion from "../Accordion";
import Box from "../Box";
import BoxContainer from "../BoxContainer";
import Button from "../Button";
import Paper from "../Paper";
import TextField from "../TextField";
import Typography from "../Typography";
import NestedFieldArray from "./Nested";

interface SelectMultipleOptionProps {
    containerSx?: SxProps;
    control: Control;
    name: string;
}

const SelectMultipleOptions = ({
    containerSx = {
        p: 2,
        m: 0,
    },
    control,
    name,
}: SelectMultipleOptionProps) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    const isChildOption = name !== "options";

    const handleAdd = () =>
        append(
            isChildOption
                ? { label: "" }
                : {
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
                  }
        );

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
                            }}>
                            <TextField
                                key={option.value}
                                control={control}
                                name={`${name}.${index}.label`}
                                label=""
                                sx={{
                                    backgroundColor: "white",
                                }}
                                formControlSx={{
                                    marginBottom: 0,
                                }}
                                placeholder="label"
                            />
                        </Box>
                    </Box>

                    {!isChildOption && (
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
                                        />
                                    }
                                    sx={{ m: 0, mb: 0, p: 0 }}
                                />
                            </Paper>
                        </Box>
                    )}

                    <Box sx={{ p: 0, m: 0, mt: 2 }}>
                        <Button
                            onClick={() => handleRemove(index)}
                            startIcon={<RemoveIcon />}
                            sx={{ mt: 0 }}>
                            Remove option -
                        </Button>
                    </Box>
                </Box>
            ))}

            <Box sx={{ p: 0, mb: 5, mt: 0 }}>
                <Button onClick={handleAdd} startIcon={<AddIcon />}>
                    Add additional option
                </Button>
            </Box>
        </BoxContainer>
    );
};

export default SelectMultipleOptions;
