import React, { useMemo } from "react";
import {
    Control,
    useFieldArray,
    useFormState,
    useWatch,
} from "react-hook-form";
import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { DarFormattedField } from "@/interfaces/DataAccessRequest";
import { Option } from "@/interfaces/Option";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Typography from "@/components/Typography";
import theme, { colors } from "@/config/theme";
import { ARRAY_PREFIX } from "@/consts/dataAccess";
import { AddIcon } from "@/consts/icons";
import {
    PAGES,
    ACCOUNT,
    TEAM,
    DATASETS,
    COMPONENTS,
} from "@/consts/translation";
import { formatDarQuestion } from "@/utils/dataAccessRequest";
import { renderFormHydrationField } from "@/utils/formHydration";

const ARRAY_IDENTIFIER = "_fieldarray";

type FieldValues = {
    [key: string]: string | number | Option[] | boolean | null | undefined;
};

type FormValues = Record<string, unknown>;

interface DarFieldArrayProps {
    control: Control<FormValues>;
    fieldParent: DarFormattedField;
    setSelectedField: (fieldName: string) => void;
    selectedField?: string;
    isViewOnly?: boolean;
}

const isSelected = (selected: unknown, label: string) =>
    Array.isArray(selected) ? selected.includes(label) : selected === label;

const DarFieldArray = ({
    control,
    fieldParent,
    setSelectedField,
    selectedField,
    isViewOnly,
}: DarFieldArrayProps) => {
    const arrayName = fieldParent.name;

    const { errors } = useFormState({ control, name: arrayName });

    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );

    const { fields, append, remove } = useFieldArray({
        control,
        name: arrayName,
    });

    const formattedFields = useMemo(() => {
        return (
            fieldParent.fields
                ?.filter(field => !field.is_child)
                .map(field => formatDarQuestion(field)) || []
        );
    }, [fieldParent]);

    const parentPaths = useMemo(
        () =>
            fields.flatMap((_, rowIndex) =>
                formattedFields.map(
                    f => `${arrayName}.${rowIndex}.${f.question_id}`
                )
            ),
        [fields, formattedFields, arrayName]
    );

    const parentValues = useWatch({ control, name: parentPaths });

    const getParentValue = (rowIndex: number, fieldIdx: number) =>
        parentValues?.[rowIndex * formattedFields.length + fieldIdx];

    const generateEmptyArrayFields = useMemo(() => {
        return formattedFields?.reduce<FieldValues>((acc, field) => {
            acc[field.question_id] = undefined;
            return acc;
        }, {});
    }, [formattedFields]);

    return (
        <React.Fragment key={`${arrayName}${ARRAY_IDENTIFIER}`}>
            <Box sx={{ pl: 3, pr: 3 }}>
                <Typography variant="h3" sx={{ m: 0 }}>
                    {arrayName.replace(ARRAY_PREFIX, "")}
                </Typography>
            </Box>
            <Divider variant="fullWidth" sx={{ mb: 4 }} />

            {errors?.[arrayName]?.message && (
                <Typography sx={{ color: colors.red700 }}>
                    {errors[arrayName]?.message as string}
                </Typography>
            )}

            {fields?.map((field, fieldIndex) => (
                <Box key={`${arrayName}${field.id}`} sx={{ mb: 3, py: 0 }}>
                    {formattedFields.map((arrayField, arrayIndex) => {
                        const parentValue = getParentValue(
                            fieldIndex,
                            arrayIndex
                        );

                        return (
                            <Box
                                key={`${arrayName}${field.id}${arrayField.question_id}`}
                                sx={{
                                    m: 0,
                                    py: 0,
                                    backgroundColor:
                                        arrayField.name === selectedField
                                            ? theme.palette.grey[100]
                                            : "inherit",
                                }}>
                                {/* Render parent field */}
                                {renderFormHydrationField(
                                    { ...arrayField, disabled: isViewOnly },
                                    control,
                                    `${arrayName}.${fieldIndex}.${arrayField.question_id}`,
                                    () => setSelectedField(arrayField.name)
                                )}

                                {/* Render optional fields dependant on selected value */}
                                {arrayField.options?.flatMap(
                                    opt =>
                                        opt.children?.map(child =>
                                            isSelected(
                                                parentValue,
                                                opt.label
                                            ) ? (
                                                <Box
                                                    key={`${arrayName}${field.id}${child.question_id}`}
                                                    sx={{
                                                        p: 0,
                                                    }}>
                                                    {renderFormHydrationField(
                                                        {
                                                            ...child,
                                                            disabled:
                                                                isViewOnly,
                                                        },
                                                        control,
                                                        `${arrayName}.${fieldIndex}.${child.question_id}`,
                                                        () =>
                                                            setSelectedField(
                                                                child.name
                                                            )
                                                    )}
                                                </Box>
                                            ) : null
                                        ) ?? []
                                )}
                            </Box>
                        );
                    })}

                    {!isViewOnly && (
                        <Button
                            onClick={() => remove(fieldIndex)}
                            variant="outlined"
                            sx={{ ml: 2, mb: 1 }}
                            disabled={fields.length === 1}>
                            {t("remove")}
                        </Button>
                    )}
                </Box>
            ))}

            {!isViewOnly && (
                <Box sx={{ mb: 1, pt: 1, pb: 0, pl: 3, pr: 3 }}>
                    <Button
                        onClick={() => append(generateEmptyArrayFields)}
                        startIcon={<AddIcon sx={{ height: 14, width: 14 }} />}
                        sx={{ mb: 3 }}>
                        {t("add")}
                    </Button>
                </Box>
            )}
        </React.Fragment>
    );
};

export default DarFieldArray;
