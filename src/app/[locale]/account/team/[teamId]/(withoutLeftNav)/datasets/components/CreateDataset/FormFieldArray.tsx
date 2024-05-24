import React, { useMemo } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";
import { FormHydration, Option } from "@/interfaces/FormHydration";
import Box from "@/components/Box";
import Button from "@/components/Button";
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
    schemaFields: FormHydration[];
    fieldParent: FormHydration;
}

const ID = "id";

const FormFieldArray = ({
    control,
    schemaFields,
    fieldParent,
}: CreateDatasetProps) => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );

    const { fields, append, remove } = useFieldArray({
        control,
        name: fieldParent.title,
    });

    const generateEmptyArrayFields = useMemo(
        () =>
            fieldParent?.fields?.reduce<FieldValues>((acc, field) => {
                acc[field.title] = null;
                return acc;
            }, {}),
        [fieldParent?.fields]
    );

    return (
        <>
            {fields.map((field, index) => (
                <Box key={field.id} sx={{ mb: theme.spacing(3) }}>
                    {Object.entries(field)
                        .filter(([key]) => key !== ID)
                        .map(([key]) => {
                            const schemaField = schemaFields.find(
                                field => field.title === key
                            );

                            const testField = schemaField?.field;

                            return (
                                <React.Fragment key={key}>
                                    {testField &&
                                        renderFormHydrationField(
                                            testField,
                                            control,
                                            `${fieldParent.title}.${index}.${testField.name}`
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
        </>
    );
};

export default FormFieldArray;
