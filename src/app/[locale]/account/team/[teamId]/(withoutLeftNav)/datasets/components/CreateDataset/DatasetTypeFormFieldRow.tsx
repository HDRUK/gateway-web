import React from "react";
import { Control } from "react-hook-form";
import { FormHydration } from "@/interfaces/FormHydration";
import { Defs } from "@/interfaces/V4Schema";
import Box from "@/components/Box";
import theme from "@/config/theme";
import { N_A } from "@/consts/dataset";
import { renderFormHydrationField } from "@/utils/formHydration";

type FormValues = Record<string, unknown>;

interface DatasetTypeFormFieldRowProps {
    index: number;
    control: Control<FormValues>;
    fieldParent: FormHydration;
    fieldData: Record<string, unknown>;
    setSelectedField?: (fieldName: string, fieldArrayName: string) => void;
    schemadefs: Defs;
}

const ID = "id";

function getSubtypeOptionsFromSchema(
    schema: Defs,
    selectedLabel: string
): string[] {
    // eslint-disable-next-line
    const matchedEntry = Object.entries(schema).find(([_, value]) => {
        return value?.properties?.name?.default === selectedLabel;
    });

    if (!matchedEntry) return [N_A];

    const [baseKey] = matchedEntry;
    const subTypeKey = `${baseKey}SubTypes`;
    const enumOptions = schema[subTypeKey]?.enum;

    return Array.isArray(enumOptions) ? enumOptions : [N_A];
}

const DatasetTypeFormFieldRow = ({
    index,
    control,
    fieldParent,
    fieldData,
    setSelectedField,
    schemadefs,
}: DatasetTypeFormFieldRowProps) => {
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

                    const options = getSubtypeOptionsFromSchema(
                        schemadefs,
                        fieldData["Dataset type"]
                    ).map(v => ({ label: v, value: v }));

                    const fieldWithOptions = isSubtype
                        ? { ...field, options }
                        : { ...field, disabled: true };

                    return (
                        <React.Fragment key={key}>
                            {fieldWithOptions &&
                                renderFormHydrationField(
                                    fieldWithOptions,
                                    control,
                                    `${fieldParent.title}.${index}.${fieldWithOptions.name}`,
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
        </Box>
    );
};

export default DatasetTypeFormFieldRow;
