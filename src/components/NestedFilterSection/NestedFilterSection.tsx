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

function anotherParentHasSelectedChildren(checkboxValues: {[key: string]: boolean }, nestedCheckboxValues: {[key: string]: boolean }, thisParent: string) {
    // We can check whether there is another parent selected and a nested value selected - if so, it must be the other parent's because it can't be ours, 
    // otherwise we'd have already broken the logic that we can't have 2 parents with one having a child.
    
    if (!checkboxValues || !nestedCheckboxValues) {
        return false;
    }

    if (Object.keys(checkboxValues).length === 0 || Object.keys(nestedCheckboxValues).length === 0) {
        return false;
    }
    
    // We must have at least one child. Check that there are no parents that are not this value. If they exist, then the child must be the other's.
    const success = Object.entries(checkboxValues).some((item) => {
        return (typeof item === "object" && item[0] !== thisParent);
    });
    return success;
};

interface NestedFilterSectionProps<TFieldValues extends FieldValues, TName> {
    filterItem: { label: string; value: string; buckets: BucketCheckbox[] };
    control: Control<TFieldValues>;
    filterSection: TName;
    noFilterLabel?: string;
    placeholder?: string;
    checkboxValues: { [key: string]: boolean };
    nestedCheckboxValues: { [key: string]: boolean };
    counts?: CountType;
    countsDisabled: boolean;
    handleCheckboxChange: (updates: { [key: string]: boolean | {[key: string] : boolean}}) => void;
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
    nestedCheckboxValues,
    noFilterLabel,
    placeholder,
    counts = {},
    countsDisabled,
    handleCheckboxChange,
    setValue,
    resetFilterSection,
}: NestedFilterSectionProps<TFieldValues, TName>) => {
    const t = useTranslations("components.NestedFilterSection");
    const { field } = useController({
        control,
        name: filterSection,
    });

    // bucket.count comes from the payload with the previous query terms
    // counts come from aggregations (from payload)
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
            });
            // .filter(bucket => bucket.count !== 0);
    }, [filterItem.buckets, field.value, countsDisabled, counts]);

    if (!filterItem.buckets.length)
        return <Typography>{noFilterLabel || t("noFilters")}</Typography>;


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
                    if (checkbox["subBuckets"]?.length > 1) { // TODO: this condition means we show non-accordians initially. 
                    // Handle this better so it shows a skeleton or loading component on initial render
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
                                                return handleCheckboxChange({
                                                    [event.target.name]: value,
                                                })
                                                }
                                            }
                                            checkboxSx={{ p: 0.5 }}
                                            stopPropagation
                                            disabled={checkboxValues &&
                                                ((Object.keys(checkboxValues).length > 0) && anotherParentHasSelectedChildren(checkboxValues, nestedCheckboxValues, checkbox.label))
                                            }
                                        />
                                    }
                                    contents={
                                        <Box display="flex" flexDirection={"column"} sx={{ py: 0}}>
                                            {(checkbox && checkbox["subBuckets"] ?? null) 
                                                ? checkbox["subBuckets"].map((item) => { 
                                                    const isDisabled = checkboxValues
                                                                && ((Object.keys(checkboxValues).length > 1)
                                                                    || ((Object.keys(checkboxValues).length === 1) && Object.keys(checkboxValues)[0] !== checkbox.label)
                                                                   );
                                                    return (
                                                        <CheckboxControlled 
                                                            formControlSx={{ pl: 5, pr: 0 }} 
                                                            label={item.label} 
                                                            name={item.label}
                                                            checked={
                                                                (nestedCheckboxValues && 
                                                                nestedCheckboxValues[item.label] && !isDisabled) || false
                                                            }
                                                            onChange={(event, value) => {                                                            
                                                                return handleCheckboxChange({
                                                                    [label]: {[event.target.name]: value},
                                                                });
                                                            }}
                                                            disabled={isDisabled}
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
