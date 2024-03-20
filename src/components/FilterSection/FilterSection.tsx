"use client";

import { CSSProperties, useMemo } from "react";
import { Control, useController } from "react-hook-form";
import { List, AutoSizer } from "react-virtualized";
import { useTranslations } from "next-intl";
import { BucketCheckbox } from "@/interfaces/Filter";
import CheckboxControlled from "@/components/CheckboxControlled";
import TextField from "@/components/TextField";
import Typography from "@/components/Typography";
import { SearchIcon } from "@/consts/icons";
import ClearFilterButton from "@/app/[locale]/(logged-out)/search/components/ClearFilterButton";

interface FilterSectionProps {
    filterItem: { label: string; value: string; buckets: BucketCheckbox[] };
    control: Control;
    filterSection: string;
    noFilterLabel?: string;
    placeholder?: string;
    checkboxValues: { [key: string]: boolean };
    handleCheckboxChange: (updates: { [key: string]: boolean }) => void;
    setValue: (name: string, value: string | number) => void;
    resetFilterSection: () => void;
}
const FilterSection = ({
    filterItem,
    filterSection,
    control,
    checkboxValues,
    handleCheckboxChange,
    noFilterLabel,
    placeholder,
    setValue,
    resetFilterSection,
}: FilterSectionProps) => {
    const t = useTranslations("components.FilterSection");
    const { field } = useController({
        control,
        name: filterSection,
    });

    const checkboxes = useMemo(() => {
        return filterItem.buckets.filter(bucket =>
            bucket?.label
                ?.toLowerCase()
                ?.includes(field.value?.toLowerCase() || "")
        );
    }, [filterItem.buckets, field.value]);

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
    }) => (
        <div key={key} style={style}>
            <CheckboxControlled
                {...checkboxes[index]}
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
