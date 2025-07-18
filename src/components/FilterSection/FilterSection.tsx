"use client";

import { CSSProperties, useMemo } from "react";
import {
    Control,
    FieldValues,
    Path,
    UseFormSetValue,
    useController,
} from "react-hook-form";
import { List, AutoSizer } from "react-virtualized";
import { cloneDeep, isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { BucketCheckbox } from "@/interfaces/Filter";
import { CountType } from "@/interfaces/Search";
import CheckboxControlled from "@/components/CheckboxControlled";
import TextField from "@/components/TextField";
import Typography from "@/components/Typography";
import { SearchIcon } from "@/consts/icons";
import ClearFilterButton from "@/app/[locale]/(logged-out)/search/components/ClearFilterButton";
import HTMLContent from "../HTMLContent";

interface FilterSectionProps<TFieldValues extends FieldValues, TName> {
    filterItem: { label: string; value: string; buckets: BucketCheckbox[] };
    control: Control<TFieldValues>;
    filterSection: TName;
    noFilterLabel?: string;
    placeholder?: string;
    checkboxValues: { [key: string]: boolean };
    counts?: CountType;
    countsDisabled: boolean;
    handleCheckboxChange: (updates: { [key: string]: boolean }) => void;
    setValue: (
        name: keyof TFieldValues,
        value: UseFormSetValue<TFieldValues>
    ) => void;
    resetFilterSection: () => void;
}
const FilterSection = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
    filterItem,
    filterSection,
    control,
    checkboxValues,
    noFilterLabel,
    placeholder,
    counts = {},
    countsDisabled,
    handleCheckboxChange,
    setValue,
    resetFilterSection,
}: FilterSectionProps<TFieldValues, TName>) => {
    const t = useTranslations("components.FilterSection");
    const { field } = useController({
        control,
        name: filterSection,
    });

    const checkboxes = useMemo(() => {
        return filterItem.buckets
            .filter(bucket =>
                bucket?.label
                    ?.toString()
                    ?.toLowerCase()
                    ?.includes(field.value?.toLowerCase() || "")
            )
            .map(bucket => {
                const updatedCount = countsDisabled
                    ? undefined
                    : !isEmpty(counts)
                    ? counts[bucket.label] || 0
                    : bucket.count;

                return {
                    ...bucket,
                    count: updatedCount,
                };
            })
            .filter(bucket => bucket.count !== 0);
    }, [filterItem.buckets, field.value, countsDisabled, counts]);

    if (!filterItem.buckets.length)
        return <Typography>{noFilterLabel || t("noFilters")}</Typography>;

    const renderRow = ({
        index,
        key,
        style,
    }: {
        index: number;
        key: string;
        style: CSSProperties;
    }) => {
        const { label, ...formattedRow } = cloneDeep(checkboxes[index]);

        return (
            <div key={key} style={style}>
                <CheckboxControlled
                    label={<HTMLContent content={label} />}
                    {...formattedRow}
                    formControlSx={{ pl: 1, pr: 1 }}
                    checked={
                        (checkboxValues &&
                            checkboxValues[checkboxes[index].label]) ||
                        false
                    }
                    name={checkboxes[index].label}
                    onChange={(event, value) =>
                        handleCheckboxChange({
                            [event.target.name]: value,
                        })
                    }
                />
            </div>
        );
    };

    return (
        <>
            <TextField
                control={control}
                name={filterSection}
                label=""
                placeholder={placeholder || t("placeholder")}
                icon={SearchIcon}
                showClearButton
                setValue={setValue}
            />

            <div style={{ height: 126 }}>
                <AutoSizer disableWidth>
                    {() => {
                        return (
                            <List
                                tabIndex={-1}
                                rowRenderer={renderRow}
                                rowCount={checkboxes.length}
                                rowHeight={42}
                                width={1}
                                height={126}
                                containerStyle={{
                                    width: "100%",
                                    maxWidth: "100%",
                                }}
                                style={{ width: "100%" }}
                                // eslint-disable-next-line jsx-a11y/aria-role
                                role=""
                            />
                        );
                    }}
                </AutoSizer>
            </div>
            <ClearFilterButton
                checkboxValues={checkboxValues}
                resetFilterSection={resetFilterSection}
            />
        </>
    );
};

export default FilterSection;
