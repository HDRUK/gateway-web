"use client";

import { useMemo } from "react";
import {
    Control,
    FieldValues,
    Path,
    UseFormSetValue,
    useController,
} from "react-hook-form";
import { cloneDeep, isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { BucketCheckbox } from "@/interfaces/Filter";
import { CountType } from "@/interfaces/Search";
import Accordion from "@/components/Accordion";
import CheckboxControlled from "@/components/CheckboxControlled";
import TextField from "@/components/TextField";
import Typography from "@/components/Typography";
import { SearchIcon } from "@/consts/icons";
import ClearFilterButton from "@/app/[locale]/(logged-out)/search/components/ClearFilterButton";
import HTMLContent from "../HTMLContent";
import Box from "@/components/Box";

interface NestedFilterSectionProps<TFieldValues extends FieldValues, TName> {
    filterItem: { label: string; value: string; buckets: BucketCheckbox[] };
    control: Control<TFieldValues>;
    filterSection: TName;
    noFilterLabel?: string;
    placeholder?: string;
    checkboxValues: { [key: string]: boolean };
    counts?: CountType;
    countsDisabled: boolean;
    handleCheckboxChange: (updates: { [key: string]: boolean }) => void;
    handleNestedCheckboxChange;
    setValue: (
        name: keyof TFieldValues,
        value: UseFormSetValue<TFieldValues>
    ) => void;
    resetFilterSection: () => void;
}
const NestedFilterSection = <
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
    handleNestedCheckboxChange,
    setValue,
    resetFilterSection,
}: NestedFilterSectionProps<TFieldValues, TName>) => {
    const t = useTranslations("components.NestedFilterSection");
    const { field } = useController({
        control,
        name: filterSection,
    });

    console.log("NestedFilterSection filterItem", filterItem);
    console.log('checkboxValues',checkboxValues);

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


    console.log('checkboxes', checkboxes);
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

            <Box display="flex" flexDirection="column" alignItems="flex-start">
                {checkboxes.map(checkbox => {
                    const { label, ...formattedRow } = cloneDeep(checkbox);
                    if (checkbox["subBuckets"]?.length > 1) {
                        if (label === 'Health and disease') {
                            console.log("nested - render subfilter for ", label);
                            console.log('checkboxValues',checkboxValues);
                            console.log('checkbox', checkbox);
                        }
                        return (
                            <div> {/* key={key} style={style}> */}
                                <Accordion
                                    heading={
                                        <CheckboxControlled
                                            label={<HTMLContent content={label} />}
                                            {...formattedRow}
                                            formControlSx={{ pl: 1, pr: 1, m: 0 }}
                                            checked={
                                                (checkboxValues &&
                                                    checkboxValues[
                                                        checkbox.label
                                                    ]) ||
                                                false
                                            }
                                            name={checkbox.label}
                                            onChange={(event, value) => {
                                                console.log('update', value, event);
                                                return handleCheckboxChange({
                                                    [event.target.name]: value,
                                                })
                                                }
                                            }
                                            checkboxSx={{ p: 0.5 }}
                                            stopPropagation
                                        />
                                    }
                                    contents={
                                        <Box display="flex" flexDirection={"column"} sx={{ py: 0}}>
                                            {(checkbox && checkbox["subBuckets"] ?? null) 
                                                ? checkbox["subBuckets"].map((item) => { 
                                                    // console.log('item', item);
                                                    return (
                                                        <CheckboxControlled 
                                                            formControlSx={{ pl: 5, pr: 0 }} 
                                                            label={item.label} 
                                                            name={item.label}
                                                            onChange={(event, value) =>
                                                            {
                                                                console.log('nested update', event, value, label, item.label, item.value);
                                                            
                                                                return handleNestedCheckboxChange({
                                                                    [label]: {[event.target.name]: value},
                                                                });
                                                            }}
                                                            disabled={checkboxValues
                                                                && ((Object.keys(checkboxValues).length > 1)
                                                                    || ((Object.keys(checkboxValues).length === 1) && Object.keys(checkboxValues)[0] !== checkbox.label)
                                                                   )
                                                                }
                                                        />)
                                                    }) : null}
                                        </Box>
                                        
                                    } 
                                    variant="plain"
                                    iconLeft
                                    noIndent
                                    sx={{
                                        pl: 0.7,
                                        display: "flex",
                                        flexDirection: "column",
                                        // justifyItems: "stretch"
                                        ".MuiAccordionSummary-content": {
                        margin: 0,
                    },
                                    }}
                                    />
                            </div>
                        );
                    }
                    return (
                        <div> {/*key={key} style={style}> */}
                            <CheckboxControlled
                                label={<HTMLContent content={label} />}
                                {...formattedRow}
                                formControlSx={{ pl: 1, pr: 1 }}
                                checked={
                                    (checkboxValues &&
                                        checkboxValues[checkbox.label]) ||
                                    false
                                }
                                name={checkbox.label}
                                onChange={(event, value) =>
                                    handleCheckboxChange({
                                        [event.target.name]: value,
                                    })
                                }
                            />
                        </div>
                    );
                })}
            </Box>
                        
            <ClearFilterButton
                checkboxValues={checkboxValues}
                resetFilterSection={resetFilterSection}
            />
        </>
    );
};

export default NestedFilterSection;
