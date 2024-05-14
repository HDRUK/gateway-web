"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { inputComponents } from "@/config/forms";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import { formGetSectionStatus } from "@/utils/formHydration";
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

        console.log(validationRules);

        return validationRules;
    };

    const [selectedFormSection, setSelectedFormSection] = useState<string>();

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

    const { fields: FIELDS, append } = useFieldArray({
        control,
        name: "arrayField", // Grab from json schema of is_array_form
    });

    const getFirstLocationValues = (schema): string[] => {
        const locationSet = new Set<string>(
            schema.schema_fields.map(({ location }) => location.split(".")[0])
        );

        return Array.from(locationSet);
    };

    const formSections = useMemo(() => getFirstLocationValues(formSchema), []);

    const hasVisibleFieldsForLocation = (schema, location: string): boolean => {
        const fieldsForLocation = schema.schema_fields.filter(field =>
            field.location.startsWith(location)
        );
        return fieldsForLocation.every(field => field.field.hidden);
    };

    // Move to utils/form-hydration
    const validateSection = async (section: string) => {
        // MOVE TO UTIL
        const fields = schemaFields
            .filter(schemaField => !schemaField.field.hidden)
            .filter(({ location }) => location.startsWith(section))
            .map(field => field.title);

        return await trigger(fields, { shouldFocus: false });
    };

    const currentSectionIndex = selectedFormSection
        ? formSections.indexOf(selectedFormSection)
        : 0;

    const generateLegendItems = async (shouldValidate: boolean) => {
        const isSectionActive = (section: string) =>
            section === formSections[currentSectionIndex];

        const legendItems: LegendItem[] = await Promise.all(
            formSections.map(async section => {
                const sectionIsValid = shouldValidate
                    ? await validateSection(section)
                    : false;

                // Reset form error state
                clearErrors();

                // Get status of section
                const getSectionStatus = formGetSectionStatus(
                    isSectionActive(section),
                    sectionIsValid,
                    schemaFields,
                    section,
                    getValues
                );

                return {
                    name: section,
                    status: getSectionStatus,
                };
            })
        );

        return legendItems;
    };
    const [legendItems, setLegendItems] = useState<LegendItem[]>([]);

    // When form loaded - select first form section with displayed fields
    useEffect(() => {
        const getFirstNonHiddenSection = schema => {
            const nonHiddenField = schema.schema_fields.find(
                field => !hasVisibleFieldsForLocation(schema, field.location)
            );
            return nonHiddenField && nonHiddenField.location.split(".")[0];
        };

        const initialSection = getFirstNonHiddenSection(formSchema);
        setSelectedFormSection(initialSection);
    }, []);

    const isLastSection = () => formSections.length - 1 <= currentSectionIndex;
    const isFirstSection = () => currentSectionIndex === 0;

    useEffect(() => {
        const createLegendItems = async () => {
            const items = await generateLegendItems(true);
            setLegendItems(items);
        };

        createLegendItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFormSection]);

    const handleLegendClick = (clickedIndex: number) => {
        setSelectedFormSection(formSections[clickedIndex]);
    };

    const tabsList = [
        { label: "Online Form", value: "FORM" },
        { label: "Upload File", value: "UPLOAD" },
    ].map(tabItem => ({
        label: `${tabItem.label} `,
        value: tabItem.value,
        content: null,
    }));

    const renderFormHydrationField = ({
        label,
        name,
        required,
        component,
        placeholder,
        ...rest
    }: FormHydrationField) => {
        // const { label, name, required, component, placeholder, ...rest } =
        //     field;

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
                tabItems={tabsList}
                downloadAction={() => console.log("DOWNLOAD")}
                makeActiveAction={() => console.log("MAKE ACTIVE")}
                saveAsDraftAction={() => console.log("SAVE AS DRAFT")}
                completionPercentage={20}
                optionalPercentage={0}
            />

            {/* // MOVE FORM TO COMPONENT - RENDER JUST FORM FIELDS? // onSubmit= */}
            {/* {handleSubmit(submitForm)} */}
            <Form onSubmit={handleSubmit(tempSubmit)}>
                <Paper>
                    <FormLegend
                        items={legendItems}
                        handleClickItem={handleLegendClick}
                    />
                </Paper>
                <Paper
                    sx={{
                        marginTop: "10px",
                        marginBottom: "10px",
                        padding: 2,
                    }}>
                    <h1>{selectedFormSection}</h1>

                    <Button onClick={() => append({ fieldArray1: undefined })}>
                        APPEND
                    </Button>
                    <div>
                        {selectedFormSection &&
                            schemaFields
                                .filter(
                                    schemaField => !schemaField.field.hidden
                                )
                                .filter(({ location }) =>
                                    location.startsWith(selectedFormSection)
                                )
                                .map((fieldParent, index) => {
                                    const { field, fields } = fieldParent;

                                    if (fieldParent.is_array_form) {
                                        // console.log(field);

                                        // return FIELDS.map((field, index) => (
                                        //     <input
                                        //         key={field.id} // important to include key with field's id
                                        //         {...register(
                                        //             `test.${index}.value`
                                        //         )}
                                        //     />
                                        // ));

                                        // const joined = FIELDS.concat(fields);

                                        // TODO - maybe have two loops? one for fields one for FIELDS

                                        return (
                                            <>
                                                {FIELDS.map(field => {
                                                    console.log("ARRAY", field);
                                                    return <p>ARRAY</p>;
                                                })}

                                                {fields?.map(
                                                    (field, indexTwo) => {
                                                        // move all of below to render Field func to avoid dupe

                                                        const { title } =
                                                            fieldParent;
                                                        const {
                                                            label,
                                                            name,
                                                            required,
                                                            component,
                                                            placeholder,
                                                            ...rest
                                                        } = field;

                                                        console.log(field);

                                                        const componentType =
                                                            inputComponents[
                                                                "TextArea" as ComponentTypes
                                                            ];
                                                        return FIELDS.map(
                                                            (field, index2) => {
                                                                console.log(
                                                                    "ARRAY",
                                                                    field
                                                                );
                                                                return (
                                                                    <InputWrapper
                                                                        {...rest}
                                                                        label={
                                                                            name ||
                                                                            ""
                                                                        }
                                                                        name={`${title}.${index2}.${name}`}
                                                                        key={
                                                                            field.id ||
                                                                            `${title}.${index2}.${name}`
                                                                        }
                                                                        placeholder={
                                                                            placeholder ||
                                                                            ""
                                                                        }
                                                                        component={
                                                                            componentType
                                                                        }
                                                                        required={
                                                                            required
                                                                        }
                                                                        control={
                                                                            control
                                                                        }
                                                                        showClearButton={
                                                                            false
                                                                        }
                                                                        canCreate={
                                                                            component ===
                                                                            "Autocomplete"
                                                                        }
                                                                        // setValue={setValue}

                                                                        // label: "Notification Contacts",
                                                                        // required: true,
                                                                        // name: "notifications",
                                                                        selectOnFocus={
                                                                            component ===
                                                                            "Autocomplete"
                                                                        }
                                                                        clearOnBlur={
                                                                            component ===
                                                                            "Autocomplete"
                                                                        }
                                                                        handleHomeEndKeys={
                                                                            component ===
                                                                            "Autocomplete"
                                                                        }
                                                                        multiple={
                                                                            component ===
                                                                            "Autocomplete"
                                                                        }
                                                                        isOptionEqualToValue={(
                                                                            option: {
                                                                                value:
                                                                                    | string
                                                                                    | number;
                                                                                label: string;
                                                                            },
                                                                            value:
                                                                                | string
                                                                                | number
                                                                        ) =>
                                                                            option.value ===
                                                                            value
                                                                        }
                                                                        getChipLabel={(
                                                                            options: {
                                                                                value:
                                                                                    | string
                                                                                    | number;
                                                                                label: string;
                                                                            }[],
                                                                            value: unknown
                                                                        ) =>
                                                                            options.find(
                                                                                option =>
                                                                                    option.value ===
                                                                                    value
                                                                            )
                                                                                ?.label
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                        );
                                                    }
                                                )}
                                                <p>ADD</p>
                                            </>
                                        );
                                    }

                                    const {
                                        label,
                                        name,
                                        required,
                                        component,
                                        placeholder,
                                        ...rest
                                    } = field;

                                    console.log(field);

                                    const componentType =
                                        inputComponents[
                                            component as ComponentTypes
                                        ];

                                    // console.log(component);

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
                                            canCreate={
                                                component === "Autocomplete"
                                            }
                                            // setValue={setValue}

                                            // label: "Notification Contacts",
                                            // required: true,
                                            // name: "notifications",
                                            selectOnFocus={
                                                component === "Autocomplete"
                                            }
                                            clearOnBlur={
                                                component === "Autocomplete"
                                            }
                                            handleHomeEndKeys={
                                                component === "Autocomplete"
                                            }
                                            multiple={
                                                component === "Autocomplete"
                                            }
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
                                            ) =>
                                                options.find(
                                                    option =>
                                                        option.value === value
                                                )?.label
                                            }
                                        />
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
                        disabled={isFirstSection()}>
                        Previous
                    </Button>

                    <Button
                        onClick={() =>
                            selectedFormSection &&
                            validateSection(selectedFormSection)
                        }>
                        Validate Section
                    </Button>

                    <Button
                        onClick={() =>
                            setSelectedFormSection(
                                formSections[currentSectionIndex + 1]
                            )
                        }
                        disabled={isLastSection()}>
                        Next
                    </Button>
                    <Button type="submit">Submit</Button>
                </Paper>
            </Form>
        </>
    );
};

export default CreateDataset;
