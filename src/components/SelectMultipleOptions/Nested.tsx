import { Control, useFieldArray } from "react-hook-form";
import { IconButton } from "@mui/material";
import {
    componentsWithOptions,
    formFieldsChild,
} from "@/config/forms/questionBank";
import { AddIcon, RemoveIcon } from "@/consts/icons";
import Box from "../Box";
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
            <IconButton size="large" edge="start" onClick={() => append({})}>
                <AddIcon />
            </IconButton>

            {nestedFields?.map((nestedField, nestedIndex) => (
                <>
                    {formFieldsChild.map(field => {
                        // Hide additional options if not needed
                        if (
                            !componentsWithOptions.includes(
                                nestedField.field.component
                            ) &&
                            field.name === "field.options"
                        ) {
                            return;
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
                        <IconButton
                            size="large"
                            edge="start"
                            onClick={() => remove(index)}>
                            <RemoveIcon />
                        </IconButton>
                    </Box>
                </>
            ))}
        </>
    );
};

export default NestedFieldArray;
