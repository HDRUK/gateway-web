"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { BucketCheckbox, DateRange, Filter } from "@/interfaces/Filter";
import { Aggregations } from "@/interfaces/Search";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import FilterSection from "@/components/FilterSection";
import MapUK, { SelectedType } from "@/components/MapUK/MapUK";
import Tooltip from "@/components/Tooltip";
import Typography from "@/components/Typography";
import {
    FILTER_DATA_USE_TITLES,
    FILTER_DATE_RANGE,
    FILTER_GEOGRAPHIC_LOCATION,
    FILTER_PUBLISHER_NAME,
    filtersList,
} from "@/config/forms/filters";
import {
    formatBucketCounts,
    groupByType,
    transformQueryFiltersToForm,
} from "@/utils/filters";

const TRANSLATION_PATH = "pages.search.components.FilterPanel";
const TOOLTIP_SUFFIX = "Tooltip";

type DefaultValues = {
    [key: string]: { [key: string]: boolean };
};

const FilterPanel = ({
    filterCategory,
    filterSourceData,
    selectedFilters,
    setFilterQueryParams,
    aggregations,
}: {
    filterCategory: string;
    selectedFilters: { [filter: string]: string[] | undefined };
    filterSourceData: Filter[];
    setFilterQueryParams: (
        filterValues: string[],
        filterSection: string
    ) => void;
    aggregations?: Aggregations;
}) => {
    const t = useTranslations(TRANSLATION_PATH);

    // filterValues controls the selected values of each filter
    const [filterValues, setFilterValues] = useState<DefaultValues>({
        [FILTER_PUBLISHER_NAME]: {},
        [FILTER_DATA_USE_TITLES]: {},
        [FILTER_GEOGRAPHIC_LOCATION]: {},
        [FILTER_DATE_RANGE]: {},
    });

    useEffect(() => {
        const defaultValues: DefaultValues = {};
        filtersList.forEach(filterName => {
            defaultValues[filterName] = transformQueryFiltersToForm(
                selectedFilters[filterName]
            );
        });
        setFilterValues(defaultValues);
    }, [selectedFilters]);

    // useForm applys to the search fields above each filter (other components, such as checkboxes/map are controlled)
    const { control, setValue } = useForm({
        defaultValues: {
            [FILTER_PUBLISHER_NAME]: "",
            [FILTER_DATA_USE_TITLES]: "",
        },
    });

    const filterItems = useMemo(() => {
        return groupByType(filterSourceData, filterCategory).filter(
            filterItem => filtersList.includes(filterItem.label)
        );
    }, [filterCategory, filterSourceData]);

    const [minimised, setMinimised] = useState<string[]>([]);

    const updateCheckboxes = (
        updatedCheckbox: { [key: string]: boolean },
        filterSection: string
    ) => {
        const updates = {
            ...(filterValues[filterSection] || {}),
            ...updatedCheckbox,
        };

        const toStringArray = Object.entries(updates)
            .filter(([, value]) => value === true)
            .map(([key]) => key);

        setFilterValues({
            ...filterValues,
            [filterSection]: updates,
        });

        setFilterQueryParams(toStringArray, filterSection);
    };

    const handleUpdateMap = (mapValue: SelectedType) => {
        const selectedCountries = Object.keys(mapValue).filter(
            key => mapValue[key]
        );

        setFilterValues({
            ...filterValues,
            [FILTER_GEOGRAPHIC_LOCATION]: mapValue,
        });

        setFilterQueryParams(selectedCountries, FILTER_GEOGRAPHIC_LOCATION);
    };

    const resetFilterSection = (filterSection: string) => {
        setFilterValues({
            ...filterValues,
            [filterSection]: {},
        });

        setFilterQueryParams([], filterSection);
    };

    const renderFilterContent = (filterItem: {
        label: string;
        value: string;
        buckets: BucketCheckbox[];
    }) => {
        const { label } = filterItem;

        switch (label) {
            case FILTER_GEOGRAPHIC_LOCATION:
                return (
                    <Box style={{ display: "flex", justifyContent: "center" }}>
                        <MapUK
                            handleUpdate={handleUpdateMap}
                            counts={formatBucketCounts(
                                aggregations?.geographicLocation.buckets
                            )}
                            overrides={filterValues[FILTER_GEOGRAPHIC_LOCATION]}
                        />
                    </Box>
                );
            default:
                return (
                    <FilterSection
                        handleCheckboxChange={updatedCheckbox =>
                            updateCheckboxes(updatedCheckbox, label)
                        }
                        checkboxValues={filterValues[label]}
                        filterSection={label}
                        setValue={setValue}
                        control={control}
                        filterItem={filterItem}
                        resetFilterSection={() => resetFilterSection(label)}
                    />
                );
        }
    };

    return (
        <>
            {filterItems.map(filterItem => {
                const { label } = filterItem;

                return (
                    <Accordion
                        key={label}
                        sx={{
                            background: "transparent",
                            boxShadow: "none",
                        }}
                        expanded={!minimised.includes(label)}
                        heading={
                            <Tooltip
                                key={label}
                                placement="right"
                                title={t(`${label}${TOOLTIP_SUFFIX}`)}>
                                <Typography fontWeight="400" fontSize="20px">
                                    {t(label)}
                                </Typography>
                            </Tooltip>
                        }
                        onChange={() =>
                            setMinimised(
                                minimised.includes(label)
                                    ? minimised.filter(e => e !== label)
                                    : [...minimised, label]
                            )
                        }
                        contents={renderFilterContent(filterItem)}
                    />
                );
            })}
        </>
    );
};

export default FilterPanel;
