"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { BucketCheckbox, DateRange, Filter } from "@/interfaces/Filter";
import { Aggregations } from "@/interfaces/Search";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import FilterSection from "@/components/FilterSection";
import FilterSectionRadio from "@/components/FilterSectionRadio";
import MapUK, { SelectedType } from "@/components/MapUK/MapUK";
import Tooltip from "@/components/Tooltip";
import Typography from "@/components/Typography";
import {
    FILTER_DATA_USE_TITLES,
    FILTER_DATE_RANGE,
    FILTER_GEOGRAPHIC_LOCATION,
    FILTER_PUBLICATION_DATE,
    FILTER_PUBLISHER_NAME,
    FILTER_SECTOR,
    FILTER_ACCESS_SERVICE,
    FILTER_PROGRAMMING_LANGUAGE,
    FILTER_TYPE_CATEGORY,
    filtersList,
    FILTER_POPULATION_SIZE,
    FILTER_CONTAINS_TISSUE,
    FILTER_LICENSE,
} from "@/config/forms/filters";
import { SOURCE_GAT } from "@/config/forms/search";
import { INCLUDE_UNREPORTED } from "@/consts/filters";
import {
    formatBucketCounts,
    groupByType,
    transformQueryFiltersToForm,
} from "@/utils/filters";
import DateRangeFilter from "../DateRangeFilter";
import FilterSectionInlineSwitch from "../FilterSectionInlineSwitch";
import PopulationFilter from "../PopulationFilter";

const TRANSLATION_PATH = "pages.search.components.FilterPanel.filters";
const TOOLTIP_SUFFIX = "Tooltip";
const TOOLTIP_TITLE_LINK_SUFFIX = "Link";
const FILTER_CATEGORY_PUBLICATIONS = "paper";
const STATIC_FILTER_SOURCE = "source";
const STATIC_FILTER_SOURCE_OBJECT = {
    buckets: [
        {
            value: "FED",
            label: "Search Europe PMC",
        },
        {
            value: "GAT",
            label: "Search Gateway",
        },
    ],
    label: STATIC_FILTER_SOURCE,
    value: "",
};

type DefaultValues = {
    [key: string]: { [key: string]: boolean };
};

const TooltipTitle = (label: string, t) => {
    return label === FILTER_LICENSE
        ? t.rich(`${label}${TOOLTIP_SUFFIX}`, {
              TooltipLink: (chunks: string) => (
                  <a
                      href={t(
                          `${label}${TOOLTIP_SUFFIX}${TOOLTIP_TITLE_LINK_SUFFIX}`
                      )}>
                      {chunks}
                  </a>
              ),
          })
        : t(`${label}${TOOLTIP_SUFFIX}`);
};

const FilterPanel = ({
    filterCategory,
    filterSourceData,
    selectedFilters,
    setFilterQueryParams,
    aggregations,
    updateStaticFilter,
    getParamString,
}: {
    filterCategory: string;
    selectedFilters: { [filter: string]: string[] | undefined };
    filterSourceData: Filter[];
    setFilterQueryParams: (
        filterValues: string[],
        filterSection: string
    ) => void;
    aggregations?: Aggregations;
    updateStaticFilter: (filterSection: string, value: string) => void;
    getParamString: (paramName: string) => string | null;
}) => {
    const t = useTranslations(`${TRANSLATION_PATH}.${filterCategory}`);

    // filterValues controls the selected values of each filter
    const [filterValues, setFilterValues] = useState<DefaultValues>({
        [FILTER_PUBLISHER_NAME]: {},
        [FILTER_DATA_USE_TITLES]: {},
        [FILTER_GEOGRAPHIC_LOCATION]: {},
        [FILTER_DATE_RANGE]: {},
        [FILTER_PUBLICATION_DATE]: {},
        [FILTER_ACCESS_SERVICE]: {},
        [FILTER_PROGRAMMING_LANGUAGE]: {},
        [FILTER_TYPE_CATEGORY]: {},
        [FILTER_SECTOR]: {},
    });

    const [staticFilterValues, setStaticFilterValues] = useState<DefaultValues>(
        {
            [STATIC_FILTER_SOURCE]: {
                [getParamString(STATIC_FILTER_SOURCE) || SOURCE_GAT]: true,
            },
        }
    );

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
    const { control, setValue } = useForm<{
        [FILTER_PUBLISHER_NAME]: string;
        [FILTER_DATA_USE_TITLES]: string;
        [FILTER_SECTOR]: string;
        [FILTER_ACCESS_SERVICE]: string;
        [FILTER_PROGRAMMING_LANGUAGE]: string;
        [FILTER_TYPE_CATEGORY]: string;
    }>({
        defaultValues: {
            [FILTER_PUBLISHER_NAME]: "",
            [FILTER_DATA_USE_TITLES]: "",
            [FILTER_SECTOR]: "",
            [FILTER_ACCESS_SERVICE]: "",
        },
    });

    const filterItems = useMemo(() => {
        const formattedFilters = groupByType(
            filterSourceData,
            filterCategory
        ).filter(filterItem => filtersList.includes(filterItem.label));

        // Manually add any static filters not returned from the filters api
        if (filterCategory === FILTER_CATEGORY_PUBLICATIONS) {
            formattedFilters.unshift(STATIC_FILTER_SOURCE_OBJECT);
        }

        return formattedFilters;
    }, [filterCategory, filterSourceData]);

    const [maximised, setMaximised] = useState<string[]>([]);

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

    const handleUpdateDateRange = (dateRange: DateRange) => {
        const dateFilterName =
            filterCategory === FILTER_CATEGORY_PUBLICATIONS
                ? FILTER_PUBLICATION_DATE
                : FILTER_DATE_RANGE;

        setFilterValues({
            ...filterValues,
            dateFilterName: transformQueryFiltersToForm(
                Object.values(dateRange)
            ),
        });

        setFilterQueryParams(Object.values(dateRange), dateFilterName);
    };

    const handleUpdatePopulationSize = (
        populationSize?: number[],
        includeUnreported?: boolean
    ) => {
        const formattedPopulationSize =
            (populationSize &&
                populationSize.map(number => number.toString())) ||
            Object.keys(filterValues.populationSize);

        const completePopulationFilter =
            includeUnreported &&
            !Object.keys(filterValues.populationSize).includes(
                INCLUDE_UNREPORTED
            )
                ? formattedPopulationSize.concat(INCLUDE_UNREPORTED)
                : formattedPopulationSize.filter(
                      item => item !== INCLUDE_UNREPORTED
                  );

        setFilterValues({
            ...filterValues,
            [FILTER_POPULATION_SIZE]: transformQueryFiltersToForm(
                completePopulationFilter
            ),
        });

        setFilterQueryParams(completePopulationFilter, FILTER_POPULATION_SIZE);
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
            case STATIC_FILTER_SOURCE:
                return (
                    <FilterSectionRadio
                        filterItem={filterItem}
                        handleRadioChange={value => {
                            setStaticFilterValues({
                                ...staticFilterValues,
                                [label]: { [value]: true },
                            });
                            updateStaticFilter(label, value);
                        }}
                        value={
                            Object.keys(
                                staticFilterValues[STATIC_FILTER_SOURCE]
                            )[0]
                        }
                    />
                );
            case FILTER_GEOGRAPHIC_LOCATION:
                return (
                    <Box style={{ display: "flex", justifyContent: "center" }}>
                        <MapUK
                            handleUpdate={handleUpdateMap}
                            counts={formatBucketCounts(
                                aggregations?.geographicLocation?.buckets
                            )}
                            overrides={filterValues[FILTER_GEOGRAPHIC_LOCATION]}
                        />
                    </Box>
                );
            case FILTER_DATE_RANGE:
                return (
                    <DateRangeFilter
                        aggregations={aggregations}
                        selectedFilters={selectedFilters}
                        handleUpdate={handleUpdateDateRange}
                        filterName={FILTER_DATE_RANGE}
                    />
                );
            case FILTER_PUBLICATION_DATE:
                return (
                    <DateRangeFilter
                        aggregations={aggregations}
                        selectedFilters={selectedFilters}
                        handleUpdate={handleUpdateDateRange}
                        filterName={FILTER_PUBLICATION_DATE}
                    />
                );
            case FILTER_POPULATION_SIZE:
                return (
                    <PopulationFilter
                        aggregations={aggregations}
                        selectedFilters={selectedFilters}
                        handleUpdate={handleUpdatePopulationSize}
                    />
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
                        counts={formatBucketCounts(
                            get(aggregations, label)?.buckets
                        )}
                    />
                );
        }
    };

    return (
        <>
            {filterItems
                .sort((item1, item2) =>
                    item1.label === FILTER_CONTAINS_TISSUE
                        ? -1
                        : item2.label === FILTER_CONTAINS_TISSUE
                        ? 1
                        : 0
                )
                .map(filterItem => {
                    const { label } = filterItem;

                    if (filterItem.label === FILTER_CONTAINS_TISSUE) {
                        return (
                            <FilterSectionInlineSwitch
                                filterCategory={filterCategory}
                                filterItem={filterItem}
                                selectedFilters={selectedFilters}
                                handleRadioChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    updateCheckboxes(
                                        {
                                            [filterItem.label]:
                                                event.target.checked,
                                        },
                                        label
                                    )
                                }
                            />
                        );
                    }

                    return (
                        <Accordion
                            key={label}
                            sx={{
                                background: "transparent",
                                boxShadow: "none",
                            }}
                            expanded={maximised.includes(label)}
                            heading={
                                <Tooltip
                                    key={label}
                                    placement="right"
                                    title={TooltipTitle(label, t)}>
                                    <Typography
                                        fontWeight="400"
                                        fontSize="20px">
                                        {t(label)}
                                    </Typography>
                                </Tooltip>
                            }
                            onChange={() =>
                                setMaximised(
                                    maximised.includes(label)
                                        ? maximised.filter(e => e !== label)
                                        : [...maximised, label]
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
