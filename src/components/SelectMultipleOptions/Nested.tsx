import { Control, useFieldArray } from "react-hook-form";
import {
    componentsWithOptions,
    questionFormFields,
} from "@/config/forms/questionBank";
import { AddIcon, RemoveIcon } from "@/consts/icons";
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
            <Button
                onClick={() => append({})}
                startIcon={<AddIcon />}
                sx={{ mt: 0, mb: 3 }}>
                Add nested option
            </Button>

            {nestedFields?.map((nestedField, nestedIndex) => (
                <>
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

                    <Box sx={{ p: 0, m: 0 }}>
                        <Button
                            onClick={() => remove(nestedIndex)}
                            startIcon={<RemoveIcon />}
                            sx={{ mt: 0 }}>
                            Remove nested option
                        </Button>
                    </Box>
                </>
            ))}
        </>
    );
};

export default NestedFieldArray;
