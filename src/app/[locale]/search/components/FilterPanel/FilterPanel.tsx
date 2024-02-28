"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { BucketCheckbox, Filter } from "@/interfaces/Filter";
import { Aggregations } from "@/interfaces/Search";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import FilterSection from "@/components/FilterSection";
import MapUK, { SelectedType } from "@/components/MapUK/MapUK";
import Tooltip from "@/components/Tooltip";
import Typography from "@/components/Typography";
import {
    FILTER_GEOGRAPHIC_LOCATION,
    filtersList,
} from "@/config/forms/filters";
import {
    formatBucketCounts,
    groupByType,
    transformQueryFiltersToForm,
} from "@/utils/filters";

const TRANSLATION_PATH = "pages.search.components.FilterPanel";
const TOOLTIP_SUFFIX = "Tooltip";

const FilterPanel = ({
    filters,
    setFilterQueryParams,
    aggregations,
}: {
    filters: Filter[];
    setFilterQueryParams: (
        params: {
            [key: string]: string[];
        },
        filterSection: string
    ) => void;
    aggregations?: Aggregations;
}) => {
    const t = useTranslations(TRANSLATION_PATH);
    const searchParams = useSearchParams();
    const [filterValues, setFilterValues] = useState({
        publisherName: transformQueryFiltersToForm(
            searchParams?.get("publisherName")
        ),
        dataUseTitles: transformQueryFiltersToForm(
            searchParams?.get("dataUseTitles")
        ),
        geographicLocation: transformQueryFiltersToForm(
            searchParams?.get("geographicLocation")
        ),
    });
    const { control, setValue } = useForm({
        defaultValues: {
            publisherName: "",
            dataUseTitles: "",
            geographicLocation: "",
        },
    });

    const filterItems = useMemo(() => {
        return groupByType(filters, "dataset").filter(filterItem =>
            filtersList.includes(filterItem.label)
        );
    }, [filters]);

    const [minimised, setMinimised] = useState<string[]>([]);

    const updateCheckboxes = (
        updatedCheckbox: { [key: string]: boolean },
        filterSection: string
    ) => {
        const allUpdates = {
            ...filterValues,
            [filterSection]: {
                ...(filterValues[filterSection] || {}),
                ...updatedCheckbox,
            },
        };

        const filterQueryParams = {};

        Object.keys(allUpdates).forEach(key => {
            filterQueryParams[key] = Object.entries(allUpdates[key])
                .filter(([, value]) => value === true)
                .map(([key]) => key);
        });

        setFilterValues(allUpdates);
        setFilterQueryParams(filterQueryParams, filterSection);
    };

    const handleUpdateMap = (mapValue: SelectedType) => {
        const selectedCountries = Object.keys(mapValue).filter(
            key => mapValue[key]
        );

        setFilterQueryParams(
            { geographicLocation: selectedCountries },
            FILTER_GEOGRAPHIC_LOCATION
        );
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
