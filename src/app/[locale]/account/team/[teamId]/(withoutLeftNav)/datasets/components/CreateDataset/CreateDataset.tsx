"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { buildYup } from "schema-to-yup";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import { FormHydration, FormHydrationField } from "@/interfaces/FormHydration";
import { LegendItem } from "@/interfaces/FormLegend";
import Button from "@/components/Button";
import Form from "@/components/Form";
import FormBanner from "@/components/FormBanner";
import FormLegend from "@/components/FormLegend";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { inputComponents } from "@/config/forms";
import theme from "@/config/theme";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import {
    formGenerateLegendItems,
    getFirstLocationValues,
    hasVisibleFieldsForLocation,
    isFirstSection,
    isLastSection,
} from "@/utils/formHydration";
import formSchema from "./config/form.json";

interface CreateDatasetProps {
    test?: boolean;
}

interface FieldValidation {
    [key: string]: unknown;
}

interface SchemaValidation {
    [key: string]: FieldValidation;
}

const TAB_LIST = [
    { label: "Online Form", value: "FORM" },
    { label: "Upload File", value: "UPLOAD" },
].map(tabItem => ({
    label: `${tabItem.label} `,
    value: tabItem.value,
    content: null,
}));

const CreateDataset = ({ test }: CreateDatasetProps) => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );

    const schemaFields: FormHydration[] = formSchema.schema_fields;

    const tempSubmit = (formData: unknown) => {
        console.log(formData);
    };

    const generateValidationRules = schema => {
        const validationRules: SchemaValidation = {};

        schema.schema_fields.forEach(fieldTest => {
            const { title, validation, field } = fieldTest;

            if (validation?.schema && !field.hidden) {
                const { schema: fieldValidation } = validation;

                const validationProps = fieldValidation.properties.field;

                if (fieldValidation && validationProps) {
                    validationRules[title] = validationProps;
                }
            }
        });

        return validationRules;
    };

    const [selectedFormSection, setSelectedFormSection] = useState<string>("");

    const genSchemaTest = {
        title: "Metadata form",
        description: "Test form",
        type: "object",
        properties: generateValidationRules(formSchema),
    };

    const yupSchema = buildYup(genSchemaTest);

    const { control, handleSubmit, clearErrors, trigger, getValues } = useForm({
        mode: "onTouched",
        resolver: yupResolver(yupSchema),
    });

    const formSections = getFirstLocationValues(formSchema).filter(location =>
        hasVisibleFieldsForLocation(formSchema, location)
    );

    const currentSectionIndex = selectedFormSection
        ? formSections.indexOf(selectedFormSection)
        : 0;

    const [legendItems, setLegendItems] = useState<LegendItem[]>([]);

    // When form loaded - select first form section with displayed fields
    useEffect(() => {
        const getFirstNonHiddenSection = schema => {
            const nonHiddenField = schema.schema_fields.find(field =>
                hasVisibleFieldsForLocation(schema, field.location)
            );
            return nonHiddenField && nonHiddenField.location.split(".")[0];
        };

        const initialSection = getFirstNonHiddenSection(formSchema);
        setSelectedFormSection(initialSection);
    }, []);

    useEffect(() => {
        const createLegendItems = async () => {
            const items = await formGenerateLegendItems(
                formSections,
                selectedFormSection,
                true,
                schemaFields,
                clearErrors,
                getValues,
                trigger
            );
            setLegendItems(items);
        };

        createLegendItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFormSection]);

    const handleLegendClick = (clickedIndex: number) => {
        setSelectedFormSection(formSections[clickedIndex]);
    };

    const renderFormHydrationField = ({
        label,
        name,
        required,
        component,
        placeholder,
        ...rest
    }: FormHydrationField) => {
        const componentType = inputComponents[component as ComponentTypes];

        return (
            <InputWrapper
                {...rest}
                label={name || ""}
                name={name}
                key={name}
                placeholder={placeholder || ""}
                component={componentType}
                required={required}
                control={control}
                showClearButton={false}
                canCreate={component === "Autocomplete"}
                selectOnFocus={component === "Autocomplete"}
                clearOnBlur={component === "Autocomplete"}
                handleHomeEndKeys={component === "Autocomplete"}
                multiple={component === "Autocomplete"}
                isOptionEqualToValue={(
                    option: {
                        value: string | number;
                        label: string;
                    },
                    value: string | number
                ) => option.value === value}
                getChipLabel={(
                    options: {
                        value: string | number;
                        label: string;
                    }[],
                    value: unknown
                ) => options.find(option => option.value === value)?.label}
            />
        );
    };
    return (
        <>
            <FormBanner
                tabItems={TAB_LIST}
                downloadAction={() => console.log("DOWNLOAD")}
                makeActiveAction={() => console.log("MAKE ACTIVE")}
                saveAsDraftAction={() => console.log("SAVE AS DRAFT")}
                completionPercentage={20}
                optionalPercentage={0}
            />

            <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ flex: 1 }}>
                    <FormLegend
                        items={legendItems}
                        handleClickItem={handleLegendClick}
                    />
                </div>
                <div style={{ flex: 2 }}>
                    <Form onSubmit={handleSubmit(tempSubmit)}>
                        <Paper
                            sx={{
                                marginTop: "10px",
                                marginBottom: "10px",
                                padding: 2,
                            }}>
                            <h1>{selectedFormSection}</h1>

                            <div>
                                {selectedFormSection &&
                                    schemaFields
                                        .filter(
                                            schemaField =>
                                                !schemaField.field.hidden
                                        )
                                        .filter(({ location }) =>
                                            location.startsWith(
                                                selectedFormSection
                                            )
                                        )
                                        .map(fieldParent => {
                                            const { field } = fieldParent;

                                            return renderFormHydrationField(
                                                field
                                            );
                                        })}
                            </div>
                        </Paper>
                        <Paper
                            sx={{
                                display: "flex",
                                justifyContent: "end",
                                marginBottom: "10px",
                                padding: 2,
                            }}>
                            <Button
                                onClick={() =>
                                    setSelectedFormSection(
                                        formSections[currentSectionIndex - 1]
                                    )
                                }
                                disabled={isFirstSection(currentSectionIndex)}>
                                {t("previous")}
                            </Button>

                            <Button
                                onClick={() =>
                                    setSelectedFormSection(
                                        formSections[currentSectionIndex + 1]
                                    )
                                }
                                disabled={isLastSection(
                                    formSections,
                                    currentSectionIndex
                                )}>
                                {t("next")}
                            </Button>
                            <Button type="submit">{t("submit")}</Button>
                        </Paper>
                    </Form>
                </div>
                <div
                    style={{
                        flex: 1,
                        alignItems: "center",
                        padding: theme.spacing(2),
                    }}>
                    <Typography variant="h2">{t("guidance")}</Typography>
                </div>
            </div>
        </>
    );
};

export default CreateDataset;
