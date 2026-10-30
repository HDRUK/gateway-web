"use client";

import { ComponentType } from "react";
import { Control, FieldValues, useFieldArray } from "react-hook-form";
import { resolveSchemaNode } from "@hdruk/gwdm-view";
import {
    fieldOptions,
    InputOption,
    InputProps,
    MetadataFormComponents,
} from "@hdruk/metadata-onboard";
import { useMetadataForm } from "@hdruk/metadata-onboard/client";
import { Button } from "@hdruk/ui";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import CheckboxControlled from "@/components/CheckboxControlled";
import DatePickerControlled from "@/components/DatePickerControlled";
import InputWrapper from "@/components/InputWrapper";
import TooltipIcon from "@/components/TooltipIcon";
import { inputComponents } from "@/config/forms";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import {
    AddButtonRow,
    AddIconSmall,
    ArrayError,
    ArrayItem,
    ArrayLabel,
    GroupItem,
    RequiredMark,
    ThemeOption,
    VariantRow,
} from "./gatewayInputs.styles";

const CREATE_DATASET = `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`;

type Option = { value: string; label: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Wrapper = InputWrapper as ComponentType<any>;

export const displayOptions = (options: InputOption[]): Option[] =>
    options.map(({ value, label }) =>
        value === label
            ? { value, label }
            : { value, label: `${value} (${label})` }
    );

const placeholderOf = ({ resolved }: InputProps): string =>
    resolved.examples?.length ? String(resolved.examples[0]) : "";

const useControl = (): Control<FieldValues> => useMetadataForm().control;

const GatewayTextField = (props: InputProps) => {
    const control = useControl();
    const { name, label, required, resolved } = props;
    const numeric = resolved.kind === "number" || resolved.kind === "integer";

    return (
        <Wrapper
            control={control}
            component={inputComponents.TextField}
            name={name}
            label={label}
            required={required}
            placeholder={placeholderOf(props)}
            limit={resolved.node.maxLength}
            type={numeric ? "number" : undefined}
        />
    );
};

const GatewayTextArea = (props: InputProps) => {
    const control = useControl();
    const { name, label, required, resolved } = props;

    return (
        <Wrapper
            control={control}
            component={inputComponents.TextArea}
            name={name}
            label={label}
            required={required}
            placeholder={placeholderOf(props)}
            limit={resolved.node.maxLength}
        />
    );
};

const GatewaySelect = (props: InputProps) => {
    const control = useControl();
    const { name, label, required, options } = props;

    return (
        <Wrapper
            control={control}
            component={inputComponents.Select}
            name={name}
            label={label}
            required={required}
            options={displayOptions(options)}
        />
    );
};

const GatewayAutocomplete = (props: InputProps) => {
    const control = useControl();
    const { name, label, required, options } = props;
    const shown = displayOptions(options);

    return (
        <Wrapper
            control={control}
            component={inputComponents.Autocomplete}
            name={name}
            label={label}
            required={required}
            placeholder={placeholderOf(props)}
            options={shown}
            canCreate={!options.length}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            multiple
            isOptionEqualToValue={(option: Option, value: string) =>
                option.value === value
            }
            getChipLabel={(all: Option[], selected: string) =>
                all.find(option => option.value === selected)?.label ??
                String(selected ?? "")
            }
        />
    );
};

const GatewayDate = (props: InputProps) => {
    const { name, label, required, value, resolved, onChange } = props;
    const dateTime = resolved.node.format === "date-time";

    return (
        <DatePickerControlled
            name={name}
            label={label}
            required={required}
            value={value ? dayjs(String(value)) : null}
            onChange={date => {
                if (!date || !date.isValid()) {
                    onChange(null);
                } else {
                    onChange(
                        dateTime
                            ? date.toISOString()
                            : date.format("YYYY-MM-DD")
                    );
                }
            }}
        />
    );
};

const GatewayBoolean = (props: InputProps) => {
    const control = useControl();
    const { name, label, required, resolved } = props;

    return (
        <Wrapper
            control={control}
            component={inputComponents.SwitchInline}
            name={name}
            label={label}
            required={required}
            extraInfo={resolved.description}
        />
    );
};

const GatewayGroup = ({ name, label, required, renderFields }: InputProps) => (
    <GroupItem>
        <ArrayLabel>
            {label}
            {required && <RequiredMark>*</RequiredMark>}
        </ArrayLabel>
        {renderFields(name)}
    </GroupItem>
);

const GatewayObjectList = ({
    name,
    label,
    required,
    error,
    renderFields,
}: InputProps) => {
    const control = useControl();
    const t = useTranslations(CREATE_DATASET);
    const { fields, append, remove } = useFieldArray({ control, name });

    return (
        <div>
            <ArrayLabel>
                {label}
                {required && <RequiredMark>*</RequiredMark>}
            </ArrayLabel>
            {error && <ArrayError>{error}</ArrayError>}
            {fields.map((item, index) => (
                <ArrayItem key={item.id}>
                    {renderFields(`${name}.${index}`)}
                    <Button onClick={() => remove(index)} variant="outlined">
                        {t("remove")}
                    </Button>
                </ArrayItem>
            ))}
            <AddButtonRow>
                <Button onClick={() => append({})} startIcon={<AddIconSmall />}>
                    {t("add")}
                </Button>
            </AddButtonRow>
        </div>
    );
};

export type UnionInputProps = Pick<
    InputProps,
    "name" | "value" | "variants" | "rootSchema" | "onChange"
>;

const unionItems = ({ value, variants }: UnionInputProps) => {
    const items = (Array.isArray(value) ? value : []) as Record<
        string,
        unknown
    >[];
    const discriminator = variants.length ? variants[0].discriminator : "name";
    const indexOf = (variant: string) =>
        items.findIndex(item => item[discriminator] === variant);
    return { items, discriminator, indexOf };
};

export const UnionCheckboxes = (props: UnionInputProps) => {
    const { variants, onChange } = props;
    const { items, discriminator, indexOf } = unionItems(props);

    const toggle = (variant: string, checked: boolean) => {
        if (checked) {
            onChange([...items, { [discriminator]: variant }]);
        } else {
            onChange(items.filter(item => item[discriminator] !== variant));
        }
    };

    return (
        <>
            {variants.map(variant => (
                <ThemeOption key={variant.value}>
                    <CheckboxControlled
                        sx={{ pt: 0, pb: 0 }}
                        formControlSx={{ mb: 2 }}
                        label={variant.label}
                        name={variant.label}
                        checked={indexOf(variant.value) !== -1}
                        onChange={(_, checked) =>
                            toggle(variant.value, checked)
                        }
                    />
                    {variant.description && (
                        <TooltipIcon
                            label=""
                            content={variant.description}
                            buttonSx={{ p: 0 }}
                        />
                    )}
                </ThemeOption>
            ))}
        </>
    );
};

export const UnionVariantRows = (props: UnionInputProps) => {
    const control = useControl();
    const { name, variants, rootSchema } = props;
    const { discriminator, indexOf } = unionItems(props);

    return (
        <>
            {variants
                .filter(variant => indexOf(variant.value) !== -1)
                .map(variant => {
                    const index = indexOf(variant.value);
                    const properties = Object.entries(
                        variant.resolved.node.properties ?? {}
                    ).filter(([key]) => key !== variant.discriminator);

                    return (
                        <VariantRow key={variant.value}>
                            <Wrapper
                                control={control}
                                component={inputComponents.TextField}
                                name={`${name}.${index}.${discriminator}`}
                                label={variant.label}
                                disabled
                            />
                            {properties.map(([key, property]) => {
                                const resolved = resolveSchemaNode(
                                    property,
                                    rootSchema
                                );
                                return (
                                    <Wrapper
                                        key={key}
                                        control={control}
                                        component={inputComponents.Autocomplete}
                                        name={`${name}.${index}.${key}`}
                                        label={resolved.title ?? key}
                                        options={displayOptions(
                                            fieldOptions(resolved, rootSchema)
                                        )}
                                        selectOnFocus
                                        clearOnBlur
                                        handleHomeEndKeys
                                        multiple
                                    />
                                );
                            })}
                        </VariantRow>
                    );
                })}
        </>
    );
};

const GatewayUnionList = (props: InputProps) => (
    <>
        <UnionCheckboxes {...props} />
        <UnionVariantRows {...props} />
    </>
);

export const makeGatewayInputs = (): MetadataFormComponents => ({
    text: GatewayTextField,
    link: GatewayTextField,
    textArea: GatewayTextArea,
    select: GatewaySelect,
    tagList: GatewayAutocomplete,
    date: GatewayDate,
    unionList: GatewayUnionList,
    objectList: GatewayObjectList,
    boolean: GatewayBoolean,
    objectGrid: GatewayGroup,
    nestedSection: GatewayGroup,
});

export const gatewayInputs = makeGatewayInputs();
