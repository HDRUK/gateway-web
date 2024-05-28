import {
    Control,
    FieldValues,
    UseFormClearErrors,
    UseFormGetValues,
    UseFormTrigger,
} from "react-hook-form";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import {
    FormHydration,
    FormHydrationField,
    FormHydrationValidation,
} from "@/interfaces/FormHydration";
import { LegendItem, LegendStatus } from "@/interfaces/FormLegend";
import InputWrapper from "@/components/InputWrapper";
import { inputComponents } from "@/config/forms";

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
    getValues: UseFormGetValues<FieldValues>
) => {
    const allSectionFields = formGetAllSectionFields(schemaFields, section).map(
        field => field.title
    );

    return getValues(allSectionFields).every(value =>
        Array.isArray(value)
            ? value.every(obj => Object.values(obj).every(val => val == null))
            : value == null
    );
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
    getValues: UseFormGetValues<FieldValues>
) => {
    if (isSectionActive) {
        return LegendStatus.ACTIVE;
    }
    if (formSectionHasAllEmptyFields(schemaFields, section, getValues)) {
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
        .filter(field => field.location.startsWith(location))
        .every(field => !field?.field?.hidden);
    return fieldsForLocation;
};

const formGenerateLegendItems = async (
    formSections: string[],
    activeSectionName: string,
    shouldValidate: boolean,
    schemaFields: FormHydration[],
    clearErrors: UseFormClearErrors<FieldValues>,
    getValues: UseFormGetValues<FieldValues>,
    trigger: UseFormTrigger<FieldValues>
) => {
    const legendItems: LegendItem[] = await Promise.all(
        formSections.map(async section => {
            const sectionIsValid = shouldValidate
                ? await formValidateSection(schemaFields, section, trigger)
                : false;

            // Reset form error state
            clearErrors();

            // Get status of section
            const getSectionStatus = formGetSectionStatus(
                formIsSectionActive(section, activeSectionName),
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
    nameOverride?: string
) => {
    const componentType = inputComponents[component as ComponentTypes];

    return (
        <InputWrapper
            {...rest}
            label={name || ""}
            name={nameOverride || name}
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

const formatValidationItems = (items: Partial<FormHydrationValidation>[]) => ({
    type: "object",
    properties: items.reduce(
        (acc, { title, ...rest }) => ({ ...acc, [title as string]: rest }),
        []
    ),
});

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
};
