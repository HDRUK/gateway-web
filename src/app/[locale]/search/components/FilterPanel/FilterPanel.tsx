"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Filter } from "@/interfaces/Filter";
import Accordion from "@/components/Accordion";
import FilterSection from "@/components/FilterSection";
import Tooltip from "@/components/Tooltip";
import Typography from "@/components/Typography";
import { groupByType } from "@/utils/filters";

const TRANSLATION_PATH = "pages.search.components.FilterPanel";
const TOOLTIP_SUFFIX = "Tooltip";
const PUBLISHER_NAME = "publisherName";
const ENABLED_FILTERS = [PUBLISHER_NAME];

const FilterPanel = ({
    filters,
    setFilterQueryParams,
    defaultFilterState,
}: {
    filters: Filter[];
    setFilterQueryParams: (params: string) => void;
    defaultFilterState: {
        [key: string]: boolean;
    };
}) => {
    const t = useTranslations(TRANSLATION_PATH);

    const { control, setValue, watch } = useForm({
        defaultValues: {
            publisherName: {
                input: "",
                filters: defaultFilterState,
            },
        },
    });

    const filterGroups = useMemo(() => {
        return groupByType(filters, "dataset").filter(filterGroup =>
            ENABLED_FILTERS.includes(filterGroup.label)
        );
    }, [filters]);

    const [minimised, setMinimised] = useState<string[]>([]);

    const watchAll = watch();

    const publisherNameFilters = useMemo(() => {
        return Object.entries(watchAll.publisherName.filters)
            .filter(([, value]) => value === true)
            .map(([key]) => key)
            .join(",");
    }, [watchAll]);

    useEffect(() => {
        setFilterQueryParams(`${PUBLISHER_NAME}=`.concat(publisherNameFilters));
    }, [publisherNameFilters]);

    return (
        <>
            {filterGroups.map(filterGroup => {
                const { label } = filterGroup;

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
                        contents={
                            <FilterSection
                                filterSection={label}
                                setValue={setValue}
                                control={control}
                                filterItems={filterGroup}
                            />
                        }
                    />
                );
            })}
        </>
    );
};

export default FilterPanel;
