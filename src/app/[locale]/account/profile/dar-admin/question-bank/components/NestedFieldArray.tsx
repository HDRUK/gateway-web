import { Control, useFieldArray, UseFormWatch } from "react-hook-form";
import { IconButton } from "@mui/material";
import { useTranslations } from "next-intl";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import { QuestionBankQuestionForm } from "@/interfaces/QuestionBankQuestion";
import Box from "@/components/Box";
import Button from "@/components/Button";
import InputWrapper from "@/components/InputWrapper";
import { inputComponents } from "@/config/forms";
import {
    componentsWithOptions,
    questionFormFields,
} from "@/config/forms/questionBank";
import { AddIcon, CloseIcon } from "@/consts/icons";
import SelectMultipleOptions from "./SelectMultipleOptions";

interface NestedFieldArrayProps {
    control: Control;
    index: number;
    watch: UseFormWatch<QuestionBankQuestionForm>;
}

const TRANSLATION_PATH = `pages.account.profile.darAdmin.qbManagement.createPage`;

const NestedFieldArray = ({ control, index, watch }: NestedFieldArrayProps) => {
    const t = useTranslations(TRANSLATION_PATH);

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
            {nestedFields?.map((nestedField, nestedIndex) => {
                const nestedComponentType = watch(
                    `options.${index}.children.${nestedIndex}.component`,
                    nestedFields
                ) as unknown as ComponentTypes;

                return (
                    <Box
                        sx={{
                            border: 1,
                            borderColor: "greyCustom.main",
                            p: 3,
                            flexGrow: 0,
                            mb: 2,
                        }}
                        key={nestedField.id}>
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
                                    nestedComponentType
                                ) &&
                                field?.name === "options"
                            ) {
                                return undefined;
                            }

                            if (field.component === "FieldArray") {
                                return (
                                    <SelectMultipleOptions
                                        control={control}
                                        {...nestedField}
                                        name={`options.${index}.children.${nestedIndex}.${field.name}`}
                                    />
                                );
                            }

                            if (
                                field?.name === "settings" &&
                                field.checkboxes
                            ) {
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
                                        {...field}
                                        name={`options.${index}.children.${nestedIndex}.${field.name}`}
                                        checkboxes={childSettingCheckboxes}
                                        showClearButton={false}
                                    />
                                );
                            }

                            return (
                                <InputWrapper
                                    key={field.id}
                                    control={control}
                                    {...field}
                                    name={`options.${index}.children.${nestedIndex}.${field.name}`}
                                    showClearButton={false}
                                />
                            );
                        })}
                    </Box>
                );
            })}

            <Button
                onClick={() =>
                    append({
                        title: "",
                        component: inputComponents.TextField,
                        guidance: "",
                        allow_guidance_override: false,
                        force_required: false,
                        validations: [],
                    })
                }
                startIcon={<AddIcon />}
                sx={{ mt: 1 }}>
                {t("addNested")}
            </Button>
        </>
    );
};

export default NestedFieldArray;
