import { useMemo } from "react";
import { Control, useFieldArray, useFormState } from "react-hook-form";
import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { DarFormattedField } from "@/interfaces/DataAccessRequest";
import { Option } from "@/interfaces/Option";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Typography from "@/components/Typography";
import theme, { colors } from "@/config/theme";
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

const ARRAY_PREFIX = " - array";
const ARRAY_IDENTIFIER = "_fieldarray";

type FieldValues = {
    [key: string]: string | number | Option[] | boolean | null | undefined;
};

type FormValues = Record<string, unknown>;

interface DarFieldArrayProps {
    control: Control<FormValues>;
    fieldParent: DarFormattedField;
    setSelectedField?: (fieldName: string) => void;
    selectedField?: string;
}

const DarFieldArray = ({
    control,
    fieldParent,
    setSelectedField,
    selectedField,
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

    const generateEmptyArrayFields = useMemo(() => {
        return formattedFields?.reduce<FieldValues>((acc, field) => {
            acc[field.question_id] = undefined;
            return acc;
        }, {});
    }, [formattedFields]);

    return (
        <div key={`${fieldParent.name}${ARRAY_IDENTIFIER}`}>
            <Box sx={{ pl: 3, pr: 3 }}>
                <Typography variant="h3" sx={{ m: 0 }}>
                    {fieldParent.name.replace(ARRAY_PREFIX, "")}
                </Typography>
            </Box>
            <Divider variant="fullWidth" sx={{ mb: 4 }} />

            {errors?.[fieldParent.name]?.message && (
                <Typography sx={{ color: colors.red700 }}>
                    {errors[fieldParent.name]?.message as string}
                </Typography>
            )}

            {fields?.map((field, index) => (
                <Box
                    key={`${fieldParent.name}${field.id}`}
                    sx={{ mb: 3, py: 0 }}>
                    {formattedFields?.map(arrayField => (
                        <Box
                            key={arrayField.question_id}
                            sx={{
                                m: 0,
                                py: 0,
                                backgroundColor:
                                    arrayField.name === selectedField
                                        ? theme.palette.grey[100]
                                        : "inherit",
                            }}>
                            {renderFormHydrationField(
                                arrayField,
                                control,
                                `${arrayName}.${index}.${arrayField.question_id}`,
                                () => setSelectedField?.(arrayField.name)
                            )}
                        </Box>
                    ))}
                    <Button
                        onClick={() => remove(index)}
                        variant="outlined"
                        sx={{ ml: 2, mb: 1 }}>
                        {t("remove")}
                    </Button>
                </Box>
            ))}

            <Box
                sx={{
                    mb: 1,
                    pt: 1,
                    pb: 0,
                    pl: 3,
                    pr: 3,
                }}>
                <Button
                    onClick={() => append(generateEmptyArrayFields)}
                    startIcon={<AddIcon sx={{ height: 14, width: 14 }} />}
                    sx={{ mb: 3 }}>
                    {t("add")}
                </Button>
            </Box>
        </div>
    );
};

export default DarFieldArray;
