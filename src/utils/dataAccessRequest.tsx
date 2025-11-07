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

const mapKeysToValues = (keys: string[], valuesArray: (string | undefined)[]) =>
    Object.fromEntries(keys.map((key, index) => [key, valuesArray[index]]));

type Row = Record<string, string | undefined>;
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
                field.component === "ArrayField" &&
                Array.isArray(parentValues[field.name])
            ) {
                const rows: DarApplicationResponses[] =
                    parentValues[field.name];
                const inner = field.fields ?? [];
                return inner.flatMap(innerField => {
                    // base IDs per row (count rows even if values are undefined)
                    const base = rows.map(
                        (_, i) => `${field.name}.${i}.${innerField.question_id}`
                    );

                    // Children per row (only when selected)
                    const child = rows.flatMap((row, i) => {
                        const sel = row?.[innerField.question_id];
                        const children =
                            innerField.options
                                ?.filter(opt => isSelected(sel, opt.label))
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

    // Group array answers by array name: name -> { qid: string[] }
    const arrayColumnsByName = new Map<string, Map<string, string[]>>();

    userAnswers.forEach(a => {
        const arrayName = childQuestionToArrayName.get(a.question_id);
        if (!arrayName) return;

        const values = Array.isArray(a.answer)
            ? a.answer.map(v => String(v ?? ""))
            : [String(a.answer ?? "")];

        const cols =
            arrayColumnsByName.get(arrayName) ?? new Map<string, string[]>();

        const col = cols.get(a.question_id) ?? [];
        cols.set(a.question_id, col.concat(values));
        arrayColumnsByName.set(arrayName, cols);
    });

    // Format columns -> rows per array name
    const arrayRowsByName: RowsByArrayName = Object.fromEntries(
        [...arrayColumnsByName].map(([arrayName, cols]) => {
            const childIds = [...cols.keys()];
            const len = Math.max(0, ...[...cols.values()].map(a => a.length));

            const rows = Array.from({ length: len }, (_, i) =>
                Object.fromEntries(
                    childIds.map(qid => [qid, (cols.get(qid) ?? [])[i] ?? ""])
                )
            ).filter(r => Object.values(r).some(v => String(v).trim()));

            return [arrayName, rows];
        })
    );

    // Add a single blank row to arrays with no answers
    childIdsByArrayName.forEach((idSet, arrayName) => {
        if (!(arrayName in arrayRowsByName)) {
            const ids = [...idSet];
            arrayRowsByName[arrayName] = [
                Object.fromEntries(ids.map(id => [id, undefined])),
            ];
        }
    });

    return { ...nonArrayValues, ...arrayRowsByName };
};

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
            const newFile = {
                filename: response.filename,
                uuid: response.uuid,
            };

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
                        const prevValue = prev.value;

                        if (Array.isArray(prevValue)) {
                            setValue(questionId, {
                                value: prevValue.filter(v => v.uuid !== fileId),
                            });
                        } else {
                            setValue(questionId, undefined);
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

export {
    getVisibleQuestionIds,
    mapKeysToValues,
    formatDarQuestion,
    formatDarAnswers,
    createFileUploadConfig,
};
