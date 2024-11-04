import {
    Control,
    FieldValues,
    UseFormClearErrors,
    UseFormGetValues,
    UseFormTrigger,
} from "react-hook-form";
import dayjs from "dayjs";
import { get, isArray, isEmpty, isObject, set } from "lodash";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import { Metadata, Revision } from "@/interfaces/Dataset";
import {
    FormHydration,
    FormHydrationField,
    FormHydrationValidation,
} from "@/interfaces/FormHydration";
import { LegendItem, LegendStatus } from "@/interfaces/FormLegend";
import InputWrapper from "@/components/InputWrapper";
import { inputComponents } from "@/config/forms";
import { getLastSplitPart } from "./string";

type FormValues = Record<string, unknown>;

const formGetAllSectionFields = (
    schemaFields: FormHydration[],
    section: string
) =>
    schemaFields
        .filter(schemaField => !schemaField.field?.hidden)
        .filter(({ location }) => location && location.startsWith(section));

const formSectionHasAllEmptyFields = (
    schemaFields: FormHydration[],
    section: string,
    getValues: UseFormGetValues<FieldValues>,
    dirtyFields: Partial<FieldValues>
) => {
    const allSectionFields = formGetAllSectionFields(schemaFields, section).map(
        field => field.title
    );
    const hasDirtyFields = Object.keys(dirtyFields).some(key =>
        allSectionFields.some(item => item.includes(key))
    );

    if (!hasDirtyFields) {
        return true;
    }

    return getValues(allSectionFields).every(value =>
        Array.isArray(value)
            ? value.every(obj => Object.values(obj).every(val => val == null))
            : value == null
    );
};

const formGetFieldsCompletedCount = (
    schemaFields: FormHydration[],
    getValues: UseFormGetValues<FieldValues>,
    optionalFieldsOnly: boolean
) => {
    let fieldCount = 0;
    let fieldsWithValue = 0;

    // Filter out hidden fields and any array fields
    const allFields = schemaFields
        .filter(
            schemaField =>
                !schemaField.field?.hidden &&
                (optionalFieldsOnly
                    ? !schemaField.field?.required
                    : schemaField.field?.required) &&
                !schemaField?.is_array_form
        )
        .map(field => field.title);

    fieldCount += allFields.length;

    const fieldValues = getValues(allFields);

    if (allFields && fieldValues) {
        const nonEmptyCount = fieldValues.filter(
            value => value !== null && !isEmpty(value)
        ).length;

        fieldsWithValue = nonEmptyCount;
    }

    const arrayFields = schemaFields.filter(
        schemaField => schemaField?.is_array_form
    );

    // Handle field array counts
    arrayFields.forEach(array => {
        const arrayEntries = getValues(array.title);
        const arraySubFields = array.fields
            ?.filter(field =>
                optionalFieldsOnly
                    ? !field.field?.required
                    : field.field?.required
            )
            ?.map(field => field.title);

        if (arrayEntries && arraySubFields) {
            fieldCount += arraySubFields.length * arrayEntries.length;
            fieldsWithValue += arrayEntries.reduce(
                (totalCount: number, obj: { [x: string]: unknown }) => {
                    return (
                        totalCount +
                        arraySubFields.filter(field => obj[field]).length
                    );
                },
                0
            );
        }
    });

    return Math.round((fieldsWithValue / fieldCount) * 100);
};

const formSectionHasEmptyOptionalFields = (
    schemaFields: FormHydration[],
    section: string,
    getValues: UseFormGetValues<FieldValues>
): boolean => {
    const allSectionFields = formGetAllSectionFields(schemaFields, section);
    const isArrayForm = allSectionFields[0]?.is_array_form;
    const fields = isArrayForm ? allSectionFields[0].fields! : allSectionFields;

    const optionalFields = fields
        ?.filter(schemaField => !schemaField.field?.required)
        .map(schemaField => schemaField.title);

    return isArrayForm
        ? getValues(allSectionFields[0].title)?.some((item: FieldValues) =>
              optionalFields?.every(
                  field => item[field] == null || item[field] === ""
              )
          )
        : getValues(optionalFields).some(
              value => value == null || value === ""
          );
};

const formGetSectionStatus = (
    isSectionActive: boolean,
    isSectionValid: boolean,
    schemaFields: FormHydration[],
    section: string,
    getValues: UseFormGetValues<FieldValues>,
    submissionRequested: boolean,
    dirtyFields: Partial<FieldValues>
) => {
    if (isSectionActive) {
        return LegendStatus.ACTIVE;
    }
    if (
        !submissionRequested &&
        formSectionHasAllEmptyFields(
            schemaFields,
            section,
            getValues,
            dirtyFields
        )
    ) {
        return LegendStatus.UNTOUCHED;
    }
    if (!isSectionValid) {
        return LegendStatus.INVALID;
    }
    if (formSectionHasEmptyOptionalFields(schemaFields, section, getValues)) {
        return LegendStatus.OPTIONAL_REMAIN;
    }
    return LegendStatus.VALID;
};

const formValidateSection = async (
    schemaFields: FormHydration[],
    section: string,
    trigger: UseFormTrigger<FieldValues>
) => {
    const allSectionFields = formGetAllSectionFields(schemaFields, section);
    const isArrayForm = allSectionFields[0]?.is_array_form;
    const fields = isArrayForm
        ? allSectionFields[0].title
        : allSectionFields
              .filter(schemaField => !schemaField?.field?.hidden)
              .map(field => field.title);

    return await trigger(fields, { shouldFocus: false });
};

const formIsSectionActive = (section: string, activeSectionName: string) =>
    section === activeSectionName;

const hasVisibleFieldsForLocation = (
    schemaFields: FormHydration[],
    location: string
): boolean => {
    const fieldsForLocation = schemaFields
        .filter(field => field.location)
        .filter(field => field.location?.startsWith(location))
        .some(field => !field?.field?.hidden);
    return fieldsForLocation;
};

const formGenerateLegendItems = async (
    formSections: string[],
    activeSectionName: string,
    shouldValidate: boolean,
    schemaFields: FormHydration[],
    clearErrors: UseFormClearErrors<FieldValues>,
    getValues: UseFormGetValues<FieldValues>,
    trigger: UseFormTrigger<FieldValues>,
    submissionRequested: boolean,
    dirtyFields: Partial<FieldValues>
) => {
    const legendItems: LegendItem[] = await Promise.all(
        formSections.map(async section => {
            const sectionIsValid = shouldValidate
                ? await formValidateSection(schemaFields, section, trigger)
                : false;

            // Reset form error state
            if (!submissionRequested) {
                clearErrors();
            }

            // Get status of section
            const getSectionStatus = formGetSectionStatus(
                formIsSectionActive(section, activeSectionName),
                sectionIsValid,
                schemaFields,
                section,
                getValues,
                submissionRequested,
                dirtyFields
            );

            return {
                name: section,
                status: getSectionStatus,
            };
        })
    );

    return legendItems;
};

const isFirstSection = (currentSectionIndex: number) =>
    currentSectionIndex === 0;

const isLastSection = (formSections: string[], currentSectionIndex: number) =>
    formSections.length - 1 <= currentSectionIndex;

const getFirstLocationValues = (schemaFields: FormHydration[]) => {
    const locationSet = new Set<string>(
        schemaFields
            .filter(field => field.location)
            .map(({ location }) => location.split(".")[0])
    );

    return Array.from(locationSet);
};

const renderFormHydrationField = (
    { name, required, component, placeholder, ...rest }: FormHydrationField,
    control: Control<FormValues>,
    nameOverride?: string,
    setActiveField?: (fieldName: string) => void
) => {
    const componentType = inputComponents[component as ComponentTypes];
    const { options } = rest;

    return (
        <InputWrapper
            name={nameOverride || name}
            key={name}
            placeholder={placeholder || ""}
            component={componentType}
            required={required}
            control={control}
            showClearButton={false}
            canCreate={component === "Autocomplete" && !options?.length}
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
                selectedOption: {
                    value: string | number;
                    label: string;
                }
            ) =>
                options.find(option => option === selectedOption)?.label ||
                selectedOption?.value ||
                selectedOption
            }
            onFocus={() => setActiveField && setActiveField(name)}
            {...rest}
            label={name || ""}
        />
    );
};

const formatValidationItems = (items: Partial<FormHydrationValidation>[]) => ({
    type: "object",
    properties: items
        .filter(item => item !== null)
        .reduce(
            (acc, { title, ...rest }) => ({
                ...acc,
                [title as string]: rest,
            }),
            []
        ),
});

const convertRevisionsToArray = (data: {
    revisions: Revision | Revision[] | null;
}) => {
    return {
        ...data,
        revisions: Array.isArray(data.revisions)
            ? data.revisions
            : data.revisions
            ? [data.revisions]
            : [],
    };
};

const mapFormFieldsForSubmission = (
    formData: Metadata,
    schemaFields: FormHydration[]
) => {
    // Create a dictionary to map titles to locations using reduce
    const mappedSchemaFields = schemaFields.reduce(
        (
            acc: { [key: string]: string },
            { title, location, is_array_form, fields }
        ) => {
            if (is_array_form) {
                fields?.forEach(field => {
                    acc[field.title] = getLastSplitPart(field.location!, ".");
                });
            }

            acc[title] = location || "";
            return acc;
        },
        {}
    );

    const parentField = (title: string) =>
        schemaFields.find(field => field.title === title);

    // Transform the data object using Object.entries and reduce
    const transformedObject = Object.entries(formData).reduce(
        (acc: { [key: string]: string }, [key, value]) => {
            if (mappedSchemaFields[key]) {
                if (parentField(key)?.is_array_form) {
                    value.forEach(
                        (entry: { [x: string]: string }, index: number) => {
                            const arrayLocation = parentField(key)?.location;

                            Object.keys(entry).forEach(entryKey => {
                                acc[
                                    `${arrayLocation}.${index}.${mappedSchemaFields[entryKey]}`
                                ] = entry[entryKey];
                            });
                        }
                    );
                } else {
                    acc[mappedSchemaFields[key]] = value;
                }
            }
            return acc;
        },
        {}
    );

    // Use a utility function to set nested properties
    const formattedFormData = {};

    Object.entries(transformedObject).forEach(([key, value]) => {
        set(formattedFormData, key, value);
    });

    const cleanUndefinedObjects = (
        obj: Record<string, unknown>
    ): Record<string, unknown> | undefined => {
        const newObj = { ...obj };
        Object.keys(newObj).forEach(key => {
            const value = newObj[key];
            if (
                value &&
                typeof value === "object" &&
                !Array.isArray(value) &&
                !(value instanceof Date)
            ) {
                if (Object.values(value).every(val => val === undefined)) {
                    newObj[key] = null;
                }
            }
        });
        return newObj;
    };
    // this makes sure that any nested objects are not left as {}
    // - the schema needs them as either null or filled to be valid
    const cleanedFormattedFormData = cleanUndefinedObjects(
        formattedFormData
    ) as { revisions: Revision | Revision[] | null };

    return convertRevisionsToArray(cleanedFormattedFormData);
};

const mapExistingDatasetToFormFields = (
    schema: FormHydration[],
    metadata: Metadata
) => {
    const values = {};

    // Function to recursively traverse the schema
    function traverseSchema(
        schema: FormHydration[] | FormHydration,
        currentPath?: string
    ): void {
        if (isArray(schema)) {
            schema.forEach(item => {
                traverseSchema(item, currentPath);
            });
        } else if (isObject(schema)) {
            // If schema is an object with a field location
            const { location, is_array_form, field, title } = schema;
            const fullPath = currentPath
                ? `${currentPath}.${location}`
                : location || "";

            if (is_array_form) {
                // Handle array form case
                const defaultValue = get(metadata, fullPath, []);

                if (isArray(defaultValue)) {
                    const test = defaultValue.map((item, index) => {
                        const itemValues = {};

                        // Map fields of each item in the array
                        schema?.fields?.forEach(fieldSchema => {
                            const fieldLocation =
                                fieldSchema?.location?.split(".");
                            const requiredLocation =
                                fieldLocation?.[fieldLocation.length - 1];

                            const defaultValue = get(
                                metadata,
                                `${fullPath}.${index}.${requiredLocation}`,
                                null
                            );

                            const { field } = fieldSchema;
                            if (
                                defaultValue &&
                                field?.component === inputComponents.DatePicker
                            ) {
                                return set(
                                    itemValues,
                                    fieldSchema.title,
                                    dayjs(defaultValue)
                                );
                            }

                            if (
                                field?.component ===
                                    inputComponents.Autocomplete &&
                                !isArray(defaultValue)
                            ) {
                                return set(values, title, []);
                            }

                            return set(
                                itemValues,
                                fieldSchema.title,
                                defaultValue
                            );
                        });
                        return itemValues;
                    });

                    set(values, title, test);
                }
            } else {
                // Handle non-array form case
                const defaultValue = get(metadata, fullPath);

                if (
                    defaultValue &&
                    field?.component === inputComponents.DatePicker
                ) {
                    set(values, title, dayjs(defaultValue));
                } else if (
                    field?.component === inputComponents.Autocomplete &&
                    !isArray(defaultValue)
                ) {
                    set(values, title, []);
                } else if (fullPath.includes("revisions")) {
                    const revisions = get(metadata, "revisions");
                    const latestRevision = revisions?.[revisions.length - 1];

                    if (latestRevision) {
                        switch (fullPath) {
                            case "revisions.version":
                                set(
                                    values,
                                    "revision version",
                                    latestRevision.version
                                );
                                break;
                            default:
                                set(values, "revision url", latestRevision.url);
                                break;
                        }
                    }
                } else {
                    set(values, title, defaultValue);
                }
            }

            // Recursively traverse nested fields
            if (schema.fields) {
                traverseSchema(schema.fields, fullPath);
            }
        }
    }

    // Start traversal from the root of the schema
    traverseSchema(schema);

    return values as Metadata;
};

export {
    formGetAllSectionFields,
    formGetSectionStatus,
    formSectionHasAllEmptyFields,
    formSectionHasEmptyOptionalFields,
    formGenerateLegendItems,
    formValidateSection,
    isLastSection,
    isFirstSection,
    getFirstLocationValues,
    hasVisibleFieldsForLocation,
    renderFormHydrationField,
    formatValidationItems,
    formGetFieldsCompletedCount,
    mapFormFieldsForSubmission,
    mapExistingDatasetToFormFields,
};
