import React, { useMemo } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";
import { FormHydration } from "@/interfaces/FormHydration";
import { Option } from "@/interfaces/Option";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Typography from "@/components/Typography";
import theme from "@/config/theme";
import { AddIcon } from "@/consts/icons";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import { renderFormHydrationField } from "@/utils/formHydration";

type FieldValues = {
    [key: string]: string | number | Option[] | boolean | null;
};

type FormValues = Record<string, unknown>;

interface CreateDatasetProps {
    control: Control<FormValues>;
    fieldParent: FormHydration;
    setSelectedField?: (fieldName: string, fieldArrayName: string) => void;
    formArrayValues: FormValues[] | null;
}

const ID = "id";

const FormFieldArray = ({
    control,
    fieldParent,
    setSelectedField,
    formArrayValues,
}: CreateDatasetProps) => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );

    const { append, remove } = useFieldArray({
        control,
        name: fieldParent.title,
    });

    const generateEmptyArrayFields = useMemo(
        () =>
            fieldParent?.fields?.reduce<FieldValues>((acc, field) => {
                acc[field.title] = null;
                return acc;
            }, {}),
        [fieldParent]
    );

    return (
        <div key={`${fieldParent.title}_fieldarray`}>
            <Typography sx={{ mb: 1 }}>
                {fieldParent.title.replace(" Array", "")}
            </Typography>

            {formArrayValues?.map((field, index) => (
                <Box
                    key={`${fieldParent.title}${field.id}`}
                    sx={{ mb: theme.spacing(3) }}>
                    {Object.entries(field)
                        .filter(([key]) => key !== ID)
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
                    <Button onClick={() => remove(index)} variant="outlined">
                        {t("remove")}
                    </Button>
                </Box>
            ))}

            <Button
                onClick={() => append(generateEmptyArrayFields)}
                startIcon={<AddIcon sx={{ height: 14, width: 14 }} />}
                sx={{ mb: theme.spacing(3) }}>
                {t("add")}
            </Button>
        </div>
    );
};

export default FormFieldArray;
