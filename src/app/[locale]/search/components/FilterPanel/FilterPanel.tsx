"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Filter, FilterType } from "@/interfaces/Filter";
import Accordion from "@/components/Accordion";
import BarSlider from "@/components/BarSlider";
import FilterSection from "@/components/FilterSection";
import Typography from "@/components/Typography";
import { convertFilterTypesToObj, groupByType } from "@/utils/filters";
import { capitalise, splitCamelcase } from "@/utils/general";

const mockData = [
    { xValue: [0, 1000.0], yValue: 3 },
    { xValue: [1000.0, 2000.0], yValue: 24 },
    { xValue: [2000.0, 3000.0], yValue: 43 },
    { xValue: [3000.0, 4000.0], yValue: 34 },
    { xValue: [4000.0, 5000.0], yValue: 7 },
    { xValue: [5000.0, 6000.0], yValue: 62 },
    { xValue: [6000.0, 7000.0], yValue: 3 },
    { xValue: [7000.0, 8000.0], yValue: 93 },
    { xValue: [8000.0, 9000.0], yValue: 23 },
    { xValue: [9000.0, 10000.0], yValue: 63 },
];

const TRANSLATION_PATH_FILTER_PANEL = "pages.search.components.FilterPanel";

const FilterPanel = ({ filters }: { filters: Filter[] }) => {
    const t = useTranslations(TRANSLATION_PATH_FILTER_PANEL);
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

            <Typography fontWeight="400" fontSize="20px">
                {t("populationSize")}
            </Typography>
            <BarSlider
                step={1000}
                data={mockData}
                ariaLabel={t("populationSize")}
                height={130}
            />
        </>
    );
};

export default FilterPanel;
