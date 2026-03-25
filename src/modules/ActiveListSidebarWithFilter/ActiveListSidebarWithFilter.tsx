"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { Filter, FilterItem, FilterValues } from "@/interfaces/Filter";
import FilterSection from "@/components/FilterSection";
import { FILTER_PUBLISHER_NAME } from "@/config/forms/filters";
import ActiveListSidebar from "../ActiveListSidebar";
import theme from "@/config/theme";

const ActiveListSidebarWithFilter = ({
    items,
    filter,
    filterValues,
    onFilterChange,
}: {
    items: {
        label: string;
    }[];
    filter?: Filter;
    filterValues: FilterValues;
    onFilterChange: (values: FilterValues) => void;
}) => {
    const [filterItem, setFilterItem] = useState<FilterItem>();

    useEffect(() => {
        if (filter) {
            setFilterItem({
                label: filter.keys,
                value: filter.value,
                buckets: filter.buckets.map(bucket => {
                    return {
                        value: bucket.key,
                        label: bucket.key,
                        count: bucket.doc_count,
                    };
                }),
            });
        }
    }, [filter]);

    const resetFilterSection = () => {
        onFilterChange({});
    };

    const handleCheckboxChange = (updates: { [key: string]: boolean }) => {
        onFilterChange({ ...filterValues, ...updates });
    };

    const { control, setValue } = useForm<{
        [FILTER_PUBLISHER_NAME]: string;
    }>({
        defaultValues: {
            [FILTER_PUBLISHER_NAME]: "",
        },
    });

    return (
        <Box sx={{ backgroundColor: theme.palette.common.white }}>
            <Box sx={{
                position: "sticky",
                top: 0,
                zIndex: theme.zIndex.appBar,
                alignSelf: "flex-start",
            }}>
                <ActiveListSidebar items={items} disableSticky />
                {filterItem && (
                <Box sx={{ p: 1 }}>
                        <FilterSection
                            filterSection={FILTER_PUBLISHER_NAME}
                            filterItem={filterItem}
                            checkboxValues={filterValues}
                            resetFilterSection={resetFilterSection}
                            control={control}
                            countsDisabled={true}
                            handleCheckboxChange={handleCheckboxChange}
                            setValue={setValue}
                        />
                </Box>)}
            </Box>
        </Box>
    );
};

export default ActiveListSidebarWithFilter;
