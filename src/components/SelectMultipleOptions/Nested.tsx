import { Control, useFieldArray } from "react-hook-form";
import { IconButton } from "@mui/material";
import {
    componentsWithOptions,
    questionFormFields,
} from "@/config/forms/questionBank";
import { AddIcon, CloseIcon } from "@/consts/icons";
import Box from "../Box";
import Button from "../Button";
import InputWrapper from "../InputWrapper";

interface NestedFieldArrayProps {
    control: Control;
    index: number;
}

const NestedFieldArray = ({ control, index }: NestedFieldArrayProps) => {
    const {
        fields: nestedFields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: `options.${index}.children`,
    });

    return (
        <>
            {nestedFields?.map((nestedField, nestedIndex) => (
                <Box
                    sx={{
                        border: 1,
                        borderColor: "greyCustom.main",
                        p: 3,
                        flexGrow: 0,
                        mb: 2,
                    }}>
                    <Box sx={{ p: 0, m: 0, justifySelf: "flex-end" }}>
                        <IconButton
                            size="large"
                            onClick={() => remove(nestedIndex)}
                            sx={{ mt: 0 }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {questionFormFields.map(field => {
                        // Hide additional options if not needed
                        if (
                            !componentsWithOptions.includes(
                                nestedField?.component
                            ) &&
                            field?.name === "field.options"
                        ) {
                            return undefined;
                        }

                        if (field?.name === "settings" && field.checkboxes) {
                            const childSettingCheckboxes = field.checkboxes
                                .filter(
                                    checkbox => checkbox.name !== "required"
                                )
                                .map(checkbox => ({
                                    ...checkbox,
                                    name: `options.${index}.children.${nestedIndex}.${checkbox.name}`,
                                }));
                            return (
                                <InputWrapper
                                    key={field.id}
                                    control={control}
                                    setValue={() => console.log("REMOVE THIS")}
                                    {...field}
                                    name={`options.${index}.children.${nestedIndex}.${field.name}`}
                                    checkboxes={childSettingCheckboxes}
                                />
                            );
                        }

                        return (
                            <InputWrapper
                                key={field.id}
                                control={control}
                                setValue={() => console.log("REMOVE THIS")}
                                {...field}
                                name={`options.${index}.children.${nestedIndex}.${field.name}`}
                            />
                        );
                    })}
                </Box>
            ))}

            <Button
                onClick={() => append({})}
                startIcon={<AddIcon />}
                sx={{ mt: 1 }}>
                Add nested question
            </Button>
        </>
    );
};

export default NestedFieldArray;
