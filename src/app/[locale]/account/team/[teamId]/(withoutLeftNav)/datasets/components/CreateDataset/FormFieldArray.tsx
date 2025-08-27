import React, { useMemo } from "react";
import { Control, useFieldArray, useFormState } from "react-hook-form";
import { useTranslations } from "next-intl";
import { FormHydration } from "@/interfaces/FormHydration";
import { Option } from "@/interfaces/Option";
import { Defs } from "@/interfaces/V4Schema";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Typography from "@/components/Typography";
import theme, { colors } from "@/config/theme";
import { INITIAL_FORM_SECTION } from "@/consts/createDataset";
import { AddIcon } from "@/consts/icons";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import { renderFormHydrationField } from "@/utils/formHydration";
import DatasetTypeFormFieldRow from "./DatasetTypeFormFieldRow";

type FieldValues = {
    [key: string]: string | number | Option[] | boolean | null | undefined;
};

type FormValues = Record<string, unknown>;

interface CreateDatasetProps {
    control: Control<FormValues>;
    fieldParent: FormHydration;
    setSelectedField?: (fieldName: string, fieldArrayName: string) => void;
    formArrayValues: FormValues[] | null;
    schemadefs: Defs;
}

const FormFieldArray = ({
    control,
    fieldParent,
    setSelectedField,
    formArrayValues,
    schemadefs,
}: CreateDatasetProps) => {

    console.log('schemadefs formField', schemadefs)
    const { errors } = useFormState({ control, name: fieldParent.title });

    const isDatasetType = fieldParent.title
        .toLowerCase()
        .includes("dataset type array");
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );

    const { append, remove } = useFieldArray({
        control,
        name: fieldParent.title,
    });

    const generateEmptyArrayFields = useMemo(() => {
        return fieldParent?.fields?.reduce<FieldValues>((acc, field) => {
            acc[field.title] = undefined;
            return acc;
        }, {});
    }, [fieldParent]);

    return (
        <div key={`${fieldParent.title}_fieldarray`}>
            <Typography sx={{ mb: 1 }}>
                {fieldParent.title.replace(" Array", "")}
                {fieldParent.required && (
                    <Typography component="span" sx={{ color: colors.red700 }}>
                        *
                    </Typography>
                )}
            </Typography>

            {isDatasetType && (
                <Typography sx={{ mb: 1 }}>
                    Please select dataset types on {INITIAL_FORM_SECTION}
                </Typography>
            )}
            {errors?.[fieldParent.title]?.message && (
                <Typography sx={{ color: colors.red700 }}>
                    {errors[fieldParent.title].message as string}
                </Typography>
            )}
            {isDatasetType &&
                formArrayValues?.map((_, index) => (
                    <DatasetTypeFormFieldRow
                        schemadefs={schemadefs}
                        key={fieldParent.title}
                        index={index}
                        control={control}
                        fieldParent={fieldParent}
                        fieldData={formArrayValues[index]}
                        setSelectedField={setSelectedField}
                        remove={remove}
                        subtypeOptions={[]}
                    />
                ))}

            {!isDatasetType &&
                formArrayValues?.map((field, index) => (
                    <Box
                        key={`${fieldParent.title}${field.id}`}
                        sx={{ mb: theme.spacing(3) }}>
                        {Object.entries(field)
                            .filter(([key]) => key !== "id")
                            .map(([key]) => {
                                const arrayField = fieldParent?.fields?.find(
                                    field => field.title === key
                                );

                                const field = arrayField?.field;

                                return (
                                    <React.Fragment key={key}>
                                        {field &&
                                            renderFormHydrationField(
                                                field,
                                                control,
                                                `${fieldParent.title}.${index}.${field.name}`,
                                                (fieldTest: string) =>
                                                    setSelectedField &&
                                                    setSelectedField(
                                                        fieldTest,
                                                        fieldParent.title
                                                    )
                                            )}
                                    </React.Fragment>
                                );
                            })}
                        <Button
                            onClick={() => remove(index)}
                            variant="outlined">
                            {t("remove")}
                        </Button>
                    </Box>
                ))}

            {!isDatasetType && (
                <Button
                    onClick={() => append(generateEmptyArrayFields)}
                    startIcon={<AddIcon sx={{ height: 14, width: 14 }} />}
                    sx={{ mb: theme.spacing(3) }}>
                    {t("add")}
                </Button>
            )}
        </div>
    );
};

export default FormFieldArray;
