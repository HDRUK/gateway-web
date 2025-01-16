import { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { SxProps } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { AddIcon, RemoveIcon } from "@/consts/icons";
import Accordion from "../Accordion";
import Box from "../Box";
import BoxContainer from "../BoxContainer";
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
                ? { label: "", value: "" }
                : {
                      label: "",
                      children: [
                          {
                              label: "",
                              field: {
                                  options: [{ label: "", value: "" }],
                                  component: "CheckboxGroup",
                              },
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
        <BoxContainer sx={containerSx}>
            {fields.map((option, index) => (
                <>
                    <Box
                        key={option.value}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "center",
                            alignContent: "center",
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

                        <Box sx={{ p: 0, m: 0 }}>
                            <IconButton
                                size="large"
                                edge="start"
                                onClick={() => handleRemove(index)}
                                disabled={fields.length === 1}>
                                <RemoveIcon />
                            </IconButton>
                        </Box>

                        {index === fields.length - 1 && (
                            <Box sx={{ p: 0, m: 0 }}>
                                <IconButton
                                    size="large"
                                    edge="start"
                                    onClick={handleAdd}>
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        )}
                    </Box>

                    {!isChildOption && (
                        <Box>
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
                                    iconLeft
                                />
                            </Paper>
                        </Box>
                    )}
                </>
            ))}
        </BoxContainer>
    );
};

export default SelectMultipleOptions;
