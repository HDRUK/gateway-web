"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { BucketCheckbox, DateRange, Filter } from "@/interfaces/Filter";
import { Aggregations } from "@/interfaces/Search";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import FilterSection from "@/components/FilterSection";
import FilterSectionRadio from "@/components/FilterSectionRadio";
import MapUK, { SelectedType } from "@/components/MapUK/MapUK";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";
import useGTMEvent from "@/hooks/useGTMEvent";
import {
    FILTER_DATA_TYPE,
    FILTER_DATA_SUBTYPE,
    FILTER_DATA_USE_TITLES,
    FILTER_DATE_RANGE,
    FILTER_GEOGRAPHIC_LOCATION,
    FILTER_PUBLICATION_DATE,
    FILTER_PUBLICATION_TYPE,
    FILTER_PUBLISHER_NAME,
    FILTER_SECTOR,
    FILTER_ACCESS_SERVICE,
    FILTER_PROGRAMMING_LANGUAGE,
    FILTER_TYPE_CATEGORY,
    filtersList,
    FILTER_POPULATION_SIZE,
    FILTER_CONTAINS_TISSUE,
    FILTER_LICENSE,
    FILTER_MATERIAL_TYPE,
    FILTER_ORGANISATION_NAME,
    FILTER_DATA_SET_TITLES,
    FILTER_COLLECTION_NAME,
    FILTER_COLLECTION_NAMES,
    FILTER_DATA_CUSTODIAN_NETWORK,
    FILTER_FORMAT_STANDARDS,
    FILTER_COHORT_DISCOVERY,
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
const FILTER_CATEGORY_PUBLICATIONS = "paper";
const FILTER_CATEGORY_DURS = "dataUseRegister";
const FILTER_CATEGORY_TOOLS = "tool";
const FILTER_CATEGORY_COLLECTIONS = "collection";
const STATIC_FILTER_SOURCE = "source";
const STATIC_FILTER_SOURCE_OBJECT = {
    buckets: [
        {
            value: "FED",
            label: "Search Online Publications",
        },
        {
            value: "GAT",
            label: "Search Gateway Curated Publications",
        },
    ],
    label: STATIC_FILTER_SOURCE,
    value: "",
};
const FILTER_ORDERING: { [key: string]: Array<string> } = {
    dataset: [
        FILTER_CONTAINS_TISSUE,
        FILTER_COHORT_DISCOVERY,
        FILTER_DATA_TYPE,
        FILTER_DATA_SUBTYPE,
        FILTER_FORMAT_STANDARDS,
        FILTER_PUBLISHER_NAME,
        FILTER_DATA_CUSTODIAN_NETWORK,
        FILTER_COLLECTION_NAME,
        FILTER_DATA_USE_TITLES,
        FILTER_MATERIAL_TYPE,
        FILTER_ACCESS_SERVICE,
        FILTER_DATE_RANGE,
        FILTER_POPULATION_SIZE,
        FILTER_GEOGRAPHIC_LOCATION,
        FILTER_COHORT_DISCOVERY,
    ],
    dataUseRegister: [
        FILTER_DATA_SET_TITLES,
        FILTER_PUBLISHER_NAME,
        FILTER_SECTOR,
        FILTER_ORGANISATION_NAME,
        FILTER_COLLECTION_NAMES,
    ],
    collection: [FILTER_PUBLISHER_NAME, FILTER_DATA_SET_TITLES],
    paper: [
        STATIC_FILTER_SOURCE,
        FILTER_DATA_SET_TITLES,
        FILTER_PUBLICATION_DATE,
        FILTER_PUBLICATION_TYPE,
    ],
    tool: [
        FILTER_TYPE_CATEGORY,
        FILTER_DATA_SET_TITLES,
        FILTER_PROGRAMMING_LANGUAGE,
        FILTER_LICENSE,
    ],
    dataProvider: [
        FILTER_DATA_SET_TITLES,
        FILTER_DATA_TYPE,
        FILTER_GEOGRAPHIC_LOCATION,
    ],
};
const EUROPE_PMC_SOURCE_FIELD = "FED";

type DefaultValues = {
    [key: string]: { [key: string]: boolean };
};

const FilterPanel = ({
    filterCategory,
    filterSourceData,
    selectedFilters,
    setFilterQueryParams,
    aggregations,
    updateStaticFilter,
    getParamString,
    showEuropePmcModal,
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
    showEuropePmcModal: () => void;
}) => {
    const t = useTranslations(`${TRANSLATION_PATH}.${filterCategory}`);
    const searchParams = useSearchParams();
    const fireGTMEvent = useGTMEvent();

    // filterValues controls the selected values of each filter
    const [filterValues, setFilterValues] = useState<DefaultValues>({
        [FILTER_PUBLISHER_NAME]: {},
        [FILTER_DATA_CUSTODIAN_NETWORK]: {},
        [FILTER_COLLECTION_NAME]: {},
        [FILTER_COLLECTION_NAMES]: {},
        [FILTER_DATA_USE_TITLES]: {},
        [FILTER_GEOGRAPHIC_LOCATION]: {},
        [FILTER_DATE_RANGE]: {},
        [FILTER_PUBLICATION_DATE]: {},
        [FILTER_PUBLICATION_TYPE]: {},
        [FILTER_ACCESS_SERVICE]: {},
        [FILTER_PROGRAMMING_LANGUAGE]: {},
        [FILTER_TYPE_CATEGORY]: {},
        [FILTER_SECTOR]: {},
        [FILTER_MATERIAL_TYPE]: {},
        [FILTER_DATA_TYPE]: {},
        [FILTER_DATA_SUBTYPE]: {},
        [FILTER_FORMAT_STANDARDS]: {},
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

    useEffect(() => {
        if (filterCategory === FILTER_CATEGORY_PUBLICATIONS) {
            setStaticFilterValues({
                [STATIC_FILTER_SOURCE]: {
                    [getParamString(STATIC_FILTER_SOURCE) || SOURCE_GAT]: true,
                },
            });
        }
    }, [filterCategory]);

    // useForm applys to the search fields above each filter (other components, such as checkboxes/map are controlled)
    const { control, setValue } = useForm<{
        [FILTER_PUBLISHER_NAME]: string;
        [FILTER_COLLECTION_NAME]: string;
        [FILTER_COLLECTION_NAMES]: string;
        [FILTER_DATA_USE_TITLES]: string;
        [FILTER_SECTOR]: string;
        [FILTER_ACCESS_SERVICE]: string;
        [FILTER_PROGRAMMING_LANGUAGE]: string;
        [FILTER_TYPE_CATEGORY]: string;
        [FILTER_MATERIAL_TYPE]: string;
        [FILTER_DATA_TYPE]: string;
        [FILTER_DATA_SUBTYPE]: string;
        [FILTER_DATA_CUSTODIAN_NETWORK]: string;
        [FILTER_FORMAT_STANDARDS]: string;
    }>({
        defaultValues: {
            [FILTER_PUBLISHER_NAME]: "",
            [FILTER_COLLECTION_NAME]: "",
            [FILTER_COLLECTION_NAMES]: "",
            [FILTER_DATA_USE_TITLES]: "",
            [FILTER_SECTOR]: "",
            [FILTER_ACCESS_SERVICE]: "",
            [FILTER_PROGRAMMING_LANGUAGE]: "",
            [FILTER_TYPE_CATEGORY]: "",
            [FILTER_MATERIAL_TYPE]: "",
            [FILTER_DATA_TYPE]: "",
            [FILTER_DATA_SUBTYPE]: "",
            [FILTER_DATA_CUSTODIAN_NETWORK]: "",
            [FILTER_FORMAT_STANDARDS]: "",
        },
    });
    const filterItems = useMemo(() => {
        let formattedFilters = groupByType(
            filterSourceData,
            filterCategory
        ).filter(filterItem => filtersList.includes(filterItem.label));

        // Manually add any static filters not returned from the filters api
        if (filterCategory === FILTER_CATEGORY_PUBLICATIONS) {
            formattedFilters.unshift(STATIC_FILTER_SOURCE_OBJECT);
        }

        // If the selected source is 'Search Online Publications' then remove the 'Dataset' filter
        if (staticFilterValues.source.FED) {
            formattedFilters = formattedFilters.filter(
                filterItem => filterItem.label !== FILTER_DATA_SET_TITLES
            );
        }

        // If on the 'Data Uses', 'Tools' or 'Collections' tabs then remove the 'Data Custodian Network' filter
        if (
            [
                FILTER_CATEGORY_DURS,
                FILTER_CATEGORY_TOOLS,
                FILTER_CATEGORY_COLLECTIONS,
            ].includes(filterCategory)
        ) {
            formattedFilters = formattedFilters.filter(
                filterItem => filterItem.label !== FILTER_DATA_CUSTODIAN_NETWORK
            );
        }

        return formattedFilters;
    }, [filterCategory, filterSourceData, staticFilterValues]);
    const [maximised, setMaximised] = useState<string[]>([]);

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

    const updateCheckboxes = (
        updatedCheckbox: { [key: string]: boolean },
        filterSection: string
    ) => {
        const updates = {
            ...(filterValues[filterSection] || {}),
            ...updatedCheckbox,
        };

        const selectedKeys = Object.keys(updates).filter(key => updates[key]);

        const [key, value] = Object.entries(updatedCheckbox)[0];
        if (key) {
            const status = value ? "filter_applied" : "filter_removed";
            const searchTerm = searchParams?.get("query") || "";

            fireGTMEvent({
                event: status,
                filter_name: filterSection,
                filter_value: key,
                search_term: searchTerm,
            });
        }

        if (selectedKeys.length) {
            setFilterValues(prevValues => ({
                ...prevValues,
                [filterSection]: updates,
            }));
            setFilterQueryParams(selectedKeys, filterSection);
        } else {
            resetFilterSection(filterSection);
        }
    };

    const getFilterSortOrder = (
        itemA: {
            label: string;
            value: string;
            buckets: BucketCheckbox[];
        },
        itemB: {
            label: string;
            value: string;
            buckets: BucketCheckbox[];
        }
    ) => {
        const ordering = FILTER_ORDERING[filterCategory];
        if (!ordering) {
            return null;
        }

        const item1 = ordering.indexOf(itemA.label);
        const item2 = ordering.indexOf(itemB.label);

        if (item1 && item2) {
            return item1 - item2;
        }
        if (item1 && !item2) {
            return 1;
        }

        return -1;
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
                            setStaticFilterValues(prev => ({
                                ...prev,
                                [label]: { [value]: true },
                            }));
                            updateStaticFilter(label, value);

                            if (value === EUROPE_PMC_SOURCE_FIELD) {
                                showEuropePmcModal();
                            }
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
                        countsDisabled={
                            filterCategory === FILTER_CATEGORY_PUBLICATIONS &&
                            (staticFilterValues.source?.FED || false)
                        }
                    />
                );
        }
    };

    return (
        <>
            {filterItems.sort(getFilterSortOrder).map(filterItem => {
                const { label } = filterItem;
                console.log(label);

                if (
                    filterItem.label === FILTER_CONTAINS_TISSUE ||
                    filterItem.label === FILTER_COHORT_DISCOVERY
                ) {
                    return (
                        <FilterSectionInlineSwitch
                            key={filterItem.label}
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

                if (
                    filterItem.label === FILTER_MATERIAL_TYPE &&
                    !get(selectedFilters, FILTER_CONTAINS_TISSUE)?.length
                ) {
                    return null;
                }

                const isPublicationSource = label === STATIC_FILTER_SOURCE;

                return (
                    <Accordion
                        key={label}
                        sx={{
                            background: "transparent",
                            boxShadow: "none",
                            ...(isPublicationSource && {
                                ".MuiAccordionSummary-expandIconWrapper": {
                                    opacity: 0,
                                },
                                ".MuiButtonBase-root.MuiAccordionSummary-root.Mui-expanded":
                                    {
                                        cursor: "default",
                                    },
                            }),
                        }}
                        expanded={
                            maximised.includes(label) || isPublicationSource
                        }
                        heading={
                            <Box
                                sx={{
                                    display: "flex",
                                    p: 0,
                                    m: 0,
                                    flexDirection: "row",
                                    alignContent: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    pr: 3.25,
                                }}>
                                <Typography fontWeight="400" fontSize={20}>
                                    {t(label)}
                                </Typography>
                                <TooltipIcon
                                    content={t(`${label}${TOOLTIP_SUFFIX}`)}
                                    label=""
                                    buttonSx={{ p: 0 }}
                                    size="small"
                                />
                            </Box>
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
