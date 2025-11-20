"use client";

import { useMemo } from "react";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Divider, Typography } from "@mui/material";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import { QuestionBankQuestionForm } from "@/interfaces/QuestionBankQuestion";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import {
    componentsWithOptions,
    fieldsWithValidation,
    questionFormFields,
    questionValidationFormFields,
} from "@/config/forms/questionBank";
import SelectMultipleOptionsNested from "./SelectMultipleOptionsNested";
import { FileUploadFields } from "@/interfaces/FileUpload";
import apis from "@/config/apis";
import { EntityType } from "@/consts/entityTypes";
import useDelete from "@/hooks/useDelete";

interface FormQuestionsProps {
    control: Control;
    componentType: ComponentTypes;
    validationFormat?: string;
    questionId?: number;
    setValue: UseFormSetValue<QuestionBankQuestionForm>,
    watch: UseFormWatch<QuestionBankQuestionForm>;
}

const FormQuestions = ({
    control,
    componentType,
    validationFormat,
    questionId,
    setValue,
    watch,
}: FormQuestionsProps) => {
    const fileDownloadPath = `${apis.fileUploadV1Url}`;

    const removeUploadedFile = useDelete(
        `${apis.fileProcessedV1Url}`,
        {
            itemName: "File",
        }
    );

    const hydratedFormFields = useMemo(
        () =>
            questionFormFields
                .map(field => {
                    if (
                        field.name === "options" &&
                        !componentsWithOptions.includes(componentType)
                    ) {
                        return undefined;
                    }

                    return field;
                })
                .filter(field => field !== undefined),
        [componentType]
    );

    return (
        <>
            {hydratedFormFields.map(field => {
                if (field.component === "FieldArray") {
                    return (
                        <SelectMultipleOptionsNested
                            key={field.name}
                            control={control}
                            {...field}
                            name={field.name}
                            watch={watch}
                        />
                    );
                } 

                if (field.component === "FileUpload") {
                    if (componentType === "DocumentExchange") {
                        console.log(field);
                        const fileUploadFields : FileUploadFields = {
                            fileDownloadApiPath: fileDownloadPath || undefined,
                            apiPath: `${apis.fileUploadV1Url}?entity_flag=${EntityType.DOCUMENT_EXCHANGE}`,
                            onFileUploaded: async (response: { filename: any; id: any; }) => {
                                const newFile = { filename: response.filename, id: response.id };

                                setValue(
                                    "document",
                                    { value: newFile },
                                    { shouldValidate: true }
                                );
                            },
                            onFileRemove: async fileId => {

                                const response = await removeUploadedFile(fileId);

                                if (response) {
                                    setValue(
                                        "document",
                                        undefined,
                                    );
                                }
                            },
                            allowReuploading: true,
                            hideUpload: false,
                            skipImageValidation: true,
                        }

                        return (<InputWrapper
                            key={field.name}
                            control={control}
                            {...field}
                            name={field.name}
                            showClearButton={false}
                            {...fileUploadFields}
                        />)
                    }
                } else {
                    return (
                        <InputWrapper
                            key={field.name}
                            control={control}
                            {...field}
                            name={field.name}
                            showClearButton={false}
                        />
                    );
                }
            })}


            {fieldsWithValidation.includes(componentType) && (
                <Box sx={{ p: 0 }}>
                    <Divider sx={{ mb: 2.5 }} />
                    <Typography sx={{ mb: 2 }}>Validation</Typography>
                    {questionValidationFormFields
                        .filter(
                            field =>
                                field.applicableToComponent.includes(
                                    componentType
                                ) &&
                                (!field.applicableToOption ||
                                    validationFormat ===
                                        field.applicableToOption)
                        )
                        .map(field => (
                            <InputWrapper
                                key={field.name}
                                control={control}
                                {...field}
                                name={field.name}
                            />
                        ))}
                </Box>
            )}
        </>
    );
};
export default FormQuestions;
