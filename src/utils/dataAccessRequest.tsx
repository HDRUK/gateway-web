import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import {
    DarApplicationQuestion,
    DarApplicationResponses,
    DarFormattedField,
} from "@/interfaces/DataAccessRequest";
import {
    FileUploadFields,
    UploadedFileMetadata,
} from "@/interfaces/FileUpload";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import { CACHE_DAR_ANSWERS } from "@/consts/cache";
import { revalidateCacheAction } from "@/app/actions/revalidateCacheAction";

const ENTITY_TYPE_DAR_APPLICATION = "dar-application-upload";

const mapKeysToValues = (keys: string[], valuesArray: (string | undefined)[]) =>
    Object.fromEntries(keys.map((key, index) => [key, valuesArray[index]]));

const getVisibleQuestionIds = (
    filteredData: DarFormattedField[],
    parentValues: { [k: string]: string | undefined },
    staticFieldsNames: string[]
): string[] => [
    ...filteredData.flatMap(field => [
        field.question_id.toString(),
        ...(field.options
            ?.find(opt => opt.label === parentValues[field.question_id])
            ?.children.map(child => child.question_id.toString()) || []),
    ]),
    ...staticFieldsNames,
];

const formatDarQuestion = (
    field: DarApplicationQuestion
): DarFormattedField => ({
    name: field.title,
    component: field.component,
    required: field.required,
    question_id: field.question_id,
    section_id: field.section_id,
    options:
        field.options?.map(option => ({
            label: option.label,
            value: option.label,
            children:
                (option.children &&
                    Object.values(option.children)
                        .flat()
                        .map(formatDarQuestion)) ||
                [],
        })) || [],
    ...(field.component === inputComponents.RadioGroup && {
        radios: field.options?.map(option => ({
            label: option.label,
            value: option.label,
        })),
    }),
    ...(field.component === inputComponents.CheckboxGroup && {
        checkboxes: field.options?.map(option => ({
            label: option.label,
            value: option.label,
        })),
    }),
});

const createFileUploadConfig = (
    questionId: string,
    component: ComponentTypes,
    applicationId: string,
    fileDownloadApiPath: string | undefined,
    isResearcher: boolean,
    setValue: UseFormSetValue<DarApplicationResponses>,
    getValues: UseFormGetValues<DarApplicationResponses>,
    removeUploadedFile?: (id: number | string) => Promise<unknown>
): FileUploadFields => {
    return {
        fileDownloadApiPath: fileDownloadApiPath || undefined,
        apiPath: `${apis.fileUploadV1Url}?entity_flag=${ENTITY_TYPE_DAR_APPLICATION}&application_id=${applicationId}&question_id=${questionId}`,
        onFileUploaded: async response => {
            const newFile = { filename: response.filename, id: response.id };

            if (component === inputComponents.FileUpload) {
                setValue(
                    questionId,
                    { value: newFile },
                    { shouldValidate: true }
                );
            } else {
                const prev = getValues(questionId);
                const prevValue =
                    prev && typeof prev === "object"
                        ? Array.isArray(prev.value)
                            ? prev.value
                            : [prev.value]
                        : [];

                setValue(
                    questionId,
                    { value: [...prevValue, newFile] },
                    { shouldValidate: true }
                );
            }

            revalidateCacheAction(`${CACHE_DAR_ANSWERS}${applicationId}`);
        },
        ...(isResearcher &&
            removeUploadedFile && {
                onFileRemove: async fileId => {
                    const prev = getValues(questionId);
                    const response = await removeUploadedFile(fileId);

                    if (response && prev && typeof prev === "object") {
                        const prevValue = prev.value as UploadedFileMetadata[];
                        setValue(
                            questionId,
                            { value: prevValue.filter(v => v.id !== fileId) },
                            { shouldValidate: true }
                        );
                    }

                    revalidateCacheAction(
                        `${CACHE_DAR_ANSWERS}${applicationId}`
                    );
                },
            }),
        allowReuploading: true,
        hideUpload: !isResearcher,
        skipImageValidation: true,
    };
};

export {
    getVisibleQuestionIds,
    mapKeysToValues,
    formatDarQuestion,
    createFileUploadConfig,
};
