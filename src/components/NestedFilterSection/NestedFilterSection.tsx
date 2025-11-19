"use client";

import { useMemo } from "react";
import {
    Control,
    ControllerRenderProps,
    FieldValues,
    Path,
    UseFormSetValue,
    useController,
} from "react-hook-form";
import { Skeleton, Tooltip } from "@mui/material";
import { cloneDeep, isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { BucketCheckbox } from "@/interfaces/Filter";
import { CountType } from "@/interfaces/Search";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import CheckboxControlled from "@/components/CheckboxControlled";
import HTMLContent from "@/components/HTMLContent";
import TextField from "@/components/TextField";
import Typography from "@/components/Typography";
import { SearchIcon } from "@/consts/icons";
import ClearFilterButton from "@/app/[locale]/(logged-out)/search/components/ClearFilterButton";

function anotherParentHasSelectedChildren(
    checkboxValues: { [key: string]: boolean },
    nestedCheckboxValues: { [key: string]: boolean },
    thisParent: string
) {
    // We can check whether there is another parent selected and a nested value selected - if so, it must be the other parent's because it can't be ours,
    // otherwise we'd have already broken the logic that we can't have 2 parents with one having a child.
    if (
        !checkboxValues ||
        !nestedCheckboxValues ||
        Object.keys(checkboxValues).length === 0 ||
        Object.keys(nestedCheckboxValues).length === 0
    ) {
        return false;
    }

    // We must have at least one child. Check that there are no parents that are not this value. If they exist, then the child must be the other's.
    return Object.entries(checkboxValues).some(item => {
        return typeof item === "object" && item[0] !== thisParent;
    });
}

interface NestedCheckboxesProps<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
> {
    label: string;
    checkbox: BucketCheckbox;
    nestedCounts: CountType;
    checkboxValues: { [key: string]: boolean };
    nestedCheckboxValues: { [key: string]: boolean };
    handleCheckboxChange: (updates: {
        [key: string]: boolean | { [key: string]: boolean };
    }) => void;
    field: ControllerRenderProps<TFieldValues, TName>;
    disabledText: string;
}

const NestedCheckboxes = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
    label,
    checkbox,
    nestedCounts,
    checkboxValues,
    nestedCheckboxValues,
    handleCheckboxChange,
    field,
    disabledText,
}: NestedCheckboxesProps<TFieldValues, TName>) => {
    return (
        <Box display="flex" flexDirection="column" sx={{ py: 0 }}>
            {(
                checkbox && (checkbox.subBuckets ?? null)
                    ? checkbox.subBuckets.reduce((acc, item) => {
                          return acc + (nestedCounts[item.label] ?? 0);
                      }, 0)
                    : 0
            )
                ? null
                : "No subtypes match the current query"}

            {checkbox && (checkbox.subBuckets ?? null)
                ? checkbox.subBuckets
                      .filter(
                          bucket =>
                              label
                                  .toString()
                                  ?.toLowerCase()
                                  ?.includes(
                                      field.value?.toLowerCase() || ""
                                  ) ||
                              bucket?.label
                                  ?.toString()
                                  ?.toLowerCase()
                                  ?.includes(field.value?.toLowerCase() || "")
                      )
                      .map(item => {
                          if (nestedCounts[item.label] === undefined) {
                              return null;
                          }
                          const isDisabled =
                              checkboxValues &&
                              (Object.keys(checkboxValues).length > 1 ||
                                  (Object.keys(checkboxValues).length === 1 &&
                                      Object.keys(checkboxValues)[0] !==
                                          checkbox.label));
                          return (
                              <Tooltip
                                  key={item.label}
                                  title={isDisabled ? disabledText : ""}>
                                  <div>
                                      <CheckboxControlled
                                          formControlSx={{
                                              pl: 5,
                                              pr: 0,
                                          }}
                                          rawLabel={item.label}
                                          name={item.label}
                                          checked={
                                              (nestedCheckboxValues &&
                                                  nestedCheckboxValues[
                                                      item.label
                                                  ] &&
                                                  !isDisabled) ||
                                              false
                                          }
                                          onChange={(event, value) => {
                                              return handleCheckboxChange({
                                                  [label]: {
                                                      [event.target.name]:
                                                          value,
                                                  },
                                              });
                                          }}
                                          count={nestedCounts[item.label]}
                                          disabled={isDisabled}
                                      />
                                  </div>
                              </Tooltip>
                          );
                      })
                : null}
        </Box>
    );
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
    nestedCounts?: CountType;
    countsDisabled: boolean;
    handleCheckboxChange: (updates: {
        [key: string]: boolean | { [key: string]: boolean };
    }) => void;
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
    nestedCounts = {},
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

    const checkboxes = useMemo(() => {
        return filterItem.buckets
            .filter(
                bucket =>
                    bucket?.label
                        ?.toString()
                        ?.toLowerCase()
                        ?.includes(field.value?.toLowerCase() || "") ||
                    (bucket.subBuckets ?? null)?.some(
                        subBucket =>
                            nestedCounts[subBucket.label] !== undefined &&
                            subBucket.value
                                .toLowerCase()
                                ?.includes(field.value?.toLowerCase() || "")
                    )
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

            <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                sx={{ p: 0, maxHeight: 226, overflow: "auto" }}>
                {checkboxes
                    .filter(checkbox => checkbox.count > 0)
                    .map(checkbox => {
                        const { label, ...formattedRow } = cloneDeep(checkbox);

                        const outerDisabled =
                            checkboxValues &&
                            Object.keys(checkboxValues).length > 0 &&
                            anotherParentHasSelectedChildren(
                                checkboxValues,
                                nestedCheckboxValues,
                                checkbox.label
                            );

                        if (checkbox.subBuckets === undefined) {
                            return (
                                <Skeleton
                                    key={checkbox.label}
                                    variant="text"
                                    sx={{ fontSize: "2rem" }}
                                    width="100%"
                                />
                            );
                        }

                        if (checkbox.subBuckets?.length > 1) {
                            return (
                                <div
                                    style={{ width: "100%" }}
                                    key={checkbox.label}>
                                    <Tooltip
                                        title={
                                            outerDisabled
                                                ? t("filterDisabled")
                                                : ""
                                        }>
                                        <Accordion
                                            heading={
                                                <CheckboxControlled
                                                    rawLabel={label}
                                                    {...formattedRow}
                                                    formControlSx={{
                                                        pl: 1,
                                                        pr: 1,
                                                        py: 1,
                                                    }}
                                                    checked={
                                                        (checkboxValues &&
                                                            checkboxValues[
                                                                checkbox.label
                                                            ]) ||
                                                        false
                                                    }
                                                    name={checkbox.label}
                                                    onChange={(
                                                        event,
                                                        value
                                                    ) => {
                                                        return handleCheckboxChange(
                                                            {
                                                                [event.target
                                                                    .name]:
                                                                    value,
                                                            }
                                                        );
                                                    }}
                                                    count={checkbox.count}
                                                    checkboxSx={{ p: 0.5 }}
                                                    stopPropagation
                                                    disabled={outerDisabled}
                                                />
                                            }
                                            contents={
                                                <NestedCheckboxes
                                                    label={label}
                                                    checkbox={checkbox}
                                                    nestedCounts={nestedCounts}
                                                    checkboxValues={
                                                        checkboxValues
                                                    }
                                                    nestedCheckboxValues={
                                                        nestedCheckboxValues
                                                    }
                                                    handleCheckboxChange={
                                                        handleCheckboxChange
                                                    }
                                                    field={field}
                                                    disabledText={t(
                                                        "filterDisabled"
                                                    )}
                                                />
                                            }
                                            variant="plain"
                                            iconLeft
                                            noIndent
                                            sx={{
                                                pl: 0.7,
                                                display: "flex",
                                                flexDirection: "column",
                                                maxWidth: "100%",
                                                ".MuiAccordionSummary-content":
                                                    {
                                                        margin: 0,
                                                    },
                                                "&:before": { display: "none" },
                                                "&.MuiAccordion-root.Mui-expanded":
                                                    {
                                                        mt: 0,
                                                        mb: 0,
                                                    },
                                            }}
                                        />
                                    </Tooltip>
                                </div>
                            );
                        }
                        return (
                            <Tooltip
                                key={label}
                                title={
                                    outerDisabled ? t("filterDisabled") : ""
                                }>
                                <div>
                                    <CheckboxControlled
                                        label={<HTMLContent content={label} />}
                                        {...formattedRow}
                                        formControlSx={{ pl: 1, pr: 1 }}
                                        checked={
                                            (checkboxValues &&
                                                checkboxValues[
                                                    checkbox.label
                                                ]) ||
                                            false
                                        }
                                        name={checkbox.label}
                                        onChange={(event, value) =>
                                            handleCheckboxChange({
                                                [event.target.name]: value,
                                            })
                                        }
                                        count={checkbox.count}
                                        disabled={outerDisabled}
                                    />
                                </div>
                            </Tooltip>
                        );
                    })}
            </Box>

            <ClearFilterButton
                checkboxValues={checkboxValues}
                nestedCheckboxValues={nestedCheckboxValues}
                resetFilterSection={resetFilterSection}
            />
        </>
    );
};

export default NestedFilterSection;
