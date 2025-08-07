import React, { useEffect, useState } from "react";
import { Control, useFormContext } from "react-hook-form";
import Box from "@/components/Box";
import theme from "@/config/theme";
import { renderFormHydrationField } from "@/utils/formHydration";
import { FormHydration } from "@/interfaces/FormHydration";
import { Option } from "@/interfaces/Option";
import { Defs } from "@/interfaces/TraserSchema";

type FormValues = Record<string, unknown>;

interface FormFieldRowProps {
    index: number;
    control: Control<FormValues>;
    fieldParent: FormHydration;
    fieldData: Record<string, any>;
    setSelectedField?: (fieldName: string, fieldArrayName: string) => void;
    remove: (index: number) => void;
    subtypeOptions: Option[];
    schemadefs: Defs
}

const ID = "id";

function getSubtypeOptionsFromSchema(
            schema: Record<string, any>,
            selectedLabel: string
            ): string[] {

            const matchedEntry = Object.entries(schema).find(([_, value]) => {
                return value?.properties?.name?.default === selectedLabel;
            });

            if (!matchedEntry) return ['Not applicable'];

            const [baseKey] = matchedEntry;
            const subTypeKey = `${baseKey}SubTypes`;
            const enumOptions = schema[subTypeKey]?.enum;

            return Array.isArray(enumOptions) ? enumOptions : ['Not applicable'];
        }

const FormFieldRow = ({
    index,
    control,
    fieldParent,
    fieldData,
    setSelectedField,
    schemadefs,
    subtypeOptions,
}: FormFieldRowProps) => {
const dataTypeField = `${fieldParent.title}.${index}.Dataset type`
const dataSubTypeField = `${fieldParent.title}.${index}.Dataset subtypes`
console.log(dataSubTypeField)
console.log('Dataset Type Array.0.Dataset subtypes')


    // const watchedType = useWatch({
    //     control,
    //     name: dataTypeField,
    // });

    const [newSubtypeOptions, setNewSubtypeOptions] = useState(subtypeOptions);
    const { setValue, watch, resetField } = useFormContext<FormValues>();
const watchedType = watch(dataTypeField);



    return (
        <Box sx={{ mb: theme.spacing(3) }}>
            {Object.entries(fieldData)
                .filter(([key]) => key !== ID)
                .map(([key]) => {
                    const arrayField = fieldParent?.fields?.find(
                        field => field.title === key
                    );
                    const field = arrayField?.field;
                    const isSubtype = field?.name?.includes("subtype");

            const options = getSubtypeOptionsFromSchema(schemadefs, fieldData["Dataset type"]).map((v) => ({ label: v, value: v }))

                    const fieldWithOptions = isSubtype
                        ? { ...field, options,   }
                        : {...field, disabled: true};
                  

                    return (
                        <React.Fragment key={key}>
                        {fieldWithOptions &&
                            renderFormHydrationField(
                            fieldWithOptions,
                            control,
                            `${fieldParent.title}.${index}.${fieldWithOptions.name}`,
                            (fieldTest: string) =>
                                setSelectedField &&
                                setSelectedField(fieldTest, fieldParent.title),
                            )}
</React.Fragment>
                    );
                })}
        </Box>
    );
};

export default FormFieldRow;
