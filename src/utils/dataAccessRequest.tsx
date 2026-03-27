import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import {
    DarApplicationAnswer,
    DarApplicationQuestion,
    DarApplicationResponses,
    DarFormattedField,
} from "@/interfaces/DataAccessRequest";
import { FileUploadFields } from "@/interfaces/FileUpload";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import { CACHE_DAR_ANSWERS } from "@/consts/cache";
import { ARRAY_FIELD } from "@/consts/dataAccess";
import { revalidateCacheAction } from "@/app/actions/revalidateCacheAction";

const ENTITY_TYPE_DAR_APPLICATION = "dar-application-upload";

const mapKeysToValues = (keys: string[], valuesArray: unknown[]) =>
    Object.fromEntries(keys.map((key, index) => [key, valuesArray[index]]));

type Row = Record<string, unknown>;
type RowsByArrayName = Record<string, Row[]>;

const getVisibleQuestionIds = (
    filteredData: DarFormattedField[],
    parentValues: DarApplicationResponses,
    staticFieldsNames: string[]
): string[] => {
    const isSelected = (sel: string, label: string) =>
        Array.isArray(sel) ? sel.includes(label) : sel === label;

    const out = [
        ...filteredData.flatMap(field => {
            // Array field
            if (
                field.component === inputComponents.ArrayField &&
                Array.isArray(parentValues[field.name])
            ) {
                const rows = parentValues[
                    field.name
                ] as unknown as DarApplicationResponses[];
                const inner = field.fields ?? [];
                return inner.flatMap(innerField => {
                    // base IDs per row (count rows even if values are undefined)
                    const base = rows.map(
                        (_, i) => `${field.name}.${i}.${innerField.question_id}`
                    );

                    // Children per row (only when selected)
                    const child = rows.flatMap((row, i) => {
                        const sel = row?.[innerField.question_id] as
                            | string
                            | undefined;
                        const children =
                            innerField.options
                                ?.filter(
                                    opt =>
                                        sel !== null &&
                                        isSelected(sel, opt.label)
                                )
                                .flatMap(opt => opt.children ?? []) ?? [];

                        return children.map(
                            childField =>
                                `${field.name}.${i}.${childField.question_id}`
                        );
                    });

                    return [...base, ...child];
                });
            }

            // Non array field
            const children =
                field.options?.find(
                    opt => opt.label === parentValues[field.question_id]
                )?.children ?? [];

            return [
                String(field.question_id),
                ...children.map(c => String(c.question_id)),
            ];
        }),
        ...staticFieldsNames,
    ];

    return Array.from(new Set(out));
};

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
    ...(field?.fields && {
        fields: field?.fields,
    }),
    document: field.document,
    guidance: field.guidance,
});

const formatDarAnswers = (
    userAnswers: DarApplicationAnswer[] = [],
    questions: DarApplicationQuestion[] = []
) => {
    // map child question_id to its ArrayField name
    const childQuestionToArrayName = new Map(
        (questions || [])
            .filter(
                question =>
                    question.component === ARRAY_FIELD &&
                    Array.isArray(question.fields)
            )
            .flatMap(question =>
                question.fields!.flatMap(field => {
                    return [
                        [String(field.question_id), question.title],
                        ...(field.options ?? []).flatMap(option =>
                            (option.children ?? []).map(
                                option =>
                                    [
                                        String(option.question_id),
                                        question.title,
                                    ] as [string, string]
                            )
                        ),
                    ];
                })
            )
    );

    //  Set of childIds to create blank row
    const childIdsByArrayName = new Map<string, Set<string>>();
    (questions || [])
        .filter(q => q.component === ARRAY_FIELD && Array.isArray(q.fields))
        .forEach(q => {
            const set = childIdsByArrayName.get(q.title) ?? new Set<string>();
            q.fields?.forEach(f => {
                set.add(String(f.question_id));
                (f.options ?? []).forEach(opt =>
                    (opt.children ?? []).forEach(ch =>
                        set.add(String(ch.question_id))
                    )
                );
            });
            childIdsByArrayName.set(q.title, set);
        });

    // Non-array answers
    const nonArrayValues = Object.fromEntries(
        userAnswers
            .filter(a => !childQuestionToArrayName.has(a.question_id))
            .map(a => [a.question_id, a.answer])
    );

    // Group array answers by array name then by answers_index => rows
    const arrayRowsByName: RowsByArrayName = {};

    userAnswers.forEach(a => {
        const arrayName = childQuestionToArrayName.get(String(a.question_id));
        if (!arrayName) return;

        const rowIndex = a.answer_index ?? 0;

        if (!arrayRowsByName[arrayName]) {
            arrayRowsByName[arrayName] = [];
        }

        if (!arrayRowsByName[arrayName][rowIndex]) {
            arrayRowsByName[arrayName][rowIndex] = {};
        }

        arrayRowsByName[arrayName][rowIndex][String(a.question_id)] =
            a.answer ?? "";
    });

    Object.keys(arrayRowsByName).forEach(arrayName => {
        arrayRowsByName[arrayName] = arrayRowsByName[arrayName].filter(
            row => row && Object.values(row).some(v => String(v ?? "").trim())
        );
    });

    // Add a single blank row to arrays with no answers
    childIdsByArrayName.forEach((idSet, arrayName) => {
        if (!arrayRowsByName[arrayName]?.length) {
            const ids = [...idSet];
            arrayRowsByName[arrayName] = [
                Object.fromEntries(ids.map(id => [id, undefined])),
            ];
        }
    });

    return { ...nonArrayValues, ...arrayRowsByName };
};

const DAR_FILE_UPLOAD_COMPONENTS = [
    inputComponents.FileUpload,
    inputComponents.FileUploadMultiple,
    inputComponents.DocumentExchange,
] as const;

const isDarFileUploadComponent = (component: string) =>
    (DAR_FILE_UPLOAD_COMPONENTS as readonly string[]).includes(component);

const createFileUploadConfig = (
    formPath: string,
    component: ComponentTypes,
    applicationId: string,
    fileDownloadApiPath: string | undefined,
    isResearcher: boolean,
    setValue: UseFormSetValue<DarApplicationResponses>,
    getValues: UseFormGetValues<DarApplicationResponses>,
    removeUploadedFile?: (id: number | string) => Promise<unknown>,
    apiQuestionId?: string,
    answerIndex?: number
): FileUploadFields => {
    console.log("QUESTION ID -", apiQuestionId);
    return {
        fileDownloadApiPath: fileDownloadApiPath || undefined,
        apiPath: `${
            apis.fileUploadV1Url
        }?entity_flag=${ENTITY_TYPE_DAR_APPLICATION}&application_id=${applicationId}&question_id=${
            apiQuestionId ?? formPath
        }${answerIndex !== undefined ? `&answer_index=${answerIndex}` : ""}`,
        onFileUploaded: async response => {
            const newFile = {
                filename: response.filename,
                uuid: response.uuid,
            };

            if (
                component === inputComponents.FileUpload ||
                component === inputComponents.DocumentExchange
            ) {
                setValue(
                    formPath,
                    { value: newFile },
                    { shouldValidate: true }
                );
            } else {
                const prev = getValues(formPath);
                const prevValue =
                    prev && typeof prev === "object"
                        ? Array.isArray(prev.value)
                            ? prev.value
                            : [prev.value]
                        : [];

                setValue(
                    formPath,
                    { value: [...prevValue, newFile] },
                    { shouldValidate: true }
                );
            }
            revalidateCacheAction(`${CACHE_DAR_ANSWERS}${applicationId}`);
        },
        ...(isResearcher &&
            removeUploadedFile && {
                onFileRemove: async fileId => {
                    const prev = getValues(formPath);
                    const response = await removeUploadedFile(fileId);

                    if (response && prev && typeof prev === "object") {
                        const prevValue = prev.value;

                        if (Array.isArray(prevValue)) {
                            setValue(formPath, {
                                value: prevValue.filter(v => v.uuid !== fileId),
                            });
                        } else {
                            setValue(formPath, undefined);
                        }
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

const createDarFileUploadConfig = (
    formPath: string,
    component: ComponentTypes,
    applicationId: string,
    isResearcher: boolean,
    userId: string,
    teamId: string,
    setValue: UseFormSetValue<DarApplicationResponses>,
    getValues: UseFormGetValues<DarApplicationResponses>,
    removeUploadedFile?: (id: number | string) => Promise<unknown>,
    apiQuestionId?: string,
    answerIndex?: number
): FileUploadFields | undefined => {
    if (!isDarFileUploadComponent(component)) return undefined;

    const fileDownloadApiPath = isResearcher
        ? `${apis.usersV1Url}/${userId}/dar/applications/${applicationId}/files`
        : `${apis.teamsV1Url}/${teamId}/dar/applications/${applicationId}/files`;

    return createFileUploadConfig(
        formPath,
        component as ComponentTypes,
        applicationId,
        fileDownloadApiPath,
        isResearcher,
        setValue,
        getValues,
        removeUploadedFile,
        apiQuestionId,
        answerIndex
    );
};

export {
    getVisibleQuestionIds,
    mapKeysToValues,
    formatDarQuestion,
    formatDarAnswers,
    createFileUploadConfig,
    createDarFileUploadConfig,
};
