"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Filter, FilterType } from "@/interfaces/Filter";
import Accordion from "@/components/Accordion";
import FilterSection from "@/components/FilterSection";
import Typography from "@/components/Typography";
import { convertFilterTypesToObj, groupByType } from "@/utils/filters";
import { capitalise, splitCamelcase } from "@/utils/general";

const FilterPanel = ({ filters }: { filters: Filter[] }) => {
    const filterSections: FilterType[] = ["dataset"];
    const [expanded, setIsExpanded] = useState(
        convertFilterTypesToObj(filterSections, true)
    );
    const { control, setValue, watch } = useForm({
        defaultValues: convertFilterTypesToObj(filterSections, ""),
    });

    const filterGroups = useMemo(() => {
        return groupByType(filters);
    }, [filters]);

    return (
        <>
            {filterSections.map(filterSection => (
                <Accordion
                    key={filterSection}
                    sx={{ background: "transparent", boxShadow: "none" }}
                    expanded={expanded[filterSection]}
                    onChange={() =>
                        setIsExpanded({
                            ...expanded,
                            [filterSection]: !expanded[filterSection],
                        })
                    }
                    heading={
                        <Typography fontWeight="400" fontSize="20px">
                            {capitalise(splitCamelcase(filterSection))}
                        </Typography>
                    }
                    contents={
                        <FilterSection
                            filterSection={filterSection}
                            setValue={setValue}
                            value={watch(filterSection)}
                            control={control}
                            filterItems={filterGroups[filterSection]}
                        />
                    }
                />
            ))}
        </>
    );
};

export default FilterPanel;
