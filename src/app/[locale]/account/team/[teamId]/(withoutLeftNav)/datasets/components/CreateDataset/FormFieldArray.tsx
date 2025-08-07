import React, { useMemo, useState } from "react";
import {
    Control,
    useFieldArray,
    UseFormSetValue,
} from "react-hook-form";
import { useTranslations } from "next-intl";
import { FormHydration } from "@/interfaces/FormHydration";
import { Option } from "@/interfaces/Option";
import Typography from "@/components/Typography";
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
import FormFieldRow from "./FormFieldRow";

type FieldValues = {
    [key: string]: string | number | Option[] | boolean | null | undefined;
};

type FormValues = Record<string, unknown>;

interface CreateDatasetProps {
    control: Control<FormValues>;
    fieldParent: FormHydration;
    setSelectedField?: (fieldName: string, fieldArrayName: string) => void;
    formArrayValues: FormValues[] | null;
}

const FormFieldArray = ({
    control,
    fieldParent,
    setSelectedField,
    formArrayValues,
}: CreateDatasetProps) => {
    const isDatasetType = fieldParent.title.toLowerCase().includes('dataset')
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );

    const { append, remove } = useFieldArray({
        control,
        name: fieldParent.title,
    });

   // const [subtypeOptions, setSubtypeOptions] = useState<Record<number, Option[]>>({});

    const generateEmptyArrayFields = useMemo(
        () =>{
            return fieldParent?.fields?.reduce<FieldValues>((acc, field) => {
                acc[field.title] = undefined;
                return acc;
            }, {})},
        [fieldParent]
    );

    return (
        <div key={`${fieldParent.title}_fieldarray`}>
            <Typography sx={{ mb: 1 }}>
                {fieldParent.title.replace(" Array", "")}
            </Typography>

           {isDatasetType && <Typography sx={{ mb: 1 }}>
               Please select dataset types on "Welcome and form builder"
            </Typography>}

            {formArrayValues?.map((_, index) => (
                <FormFieldRow
                    key={`${fieldParent.title}-${index}`}
                    index={index}
                    control={control}
                    fieldParent={fieldParent}
                    fieldData={formArrayValues[index]}
                    setSelectedField={setSelectedField}
                    remove={remove}
                    // subtypeOptions={subtypeOptions[index] || []}
                    subtypeOptions={[]}
                />
            ))}

            {!isDatasetType && <Button
                onClick={() => append(generateEmptyArrayFields)}
                startIcon={<AddIcon sx={{ height: 14, width: 14 }} />}
                sx={{ mb: theme.spacing(3) }}>
                {t("add")}
            </Button>}
        </div>
    );
};

export default FormFieldArray;
