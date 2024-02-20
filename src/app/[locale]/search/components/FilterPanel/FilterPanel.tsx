"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Filter } from "@/interfaces/Filter";
import Accordion from "@/components/Accordion";
import FilterSection from "@/components/FilterSection";
import Typography from "@/components/Typography";
import { groupByType } from "@/utils/filters";
import { capitalise, splitCamelcase } from "@/utils/general";

const FilterPanel = ({ filters }: { filters: Filter[] }) => {
    const { control, setValue, watch } = useForm({
        defaultValues: {
            publisherName: {
                input: "",
                filters: [],
            },
        },
    });

    const filterGroups = useMemo(() => {
        return groupByType(filters, "dataset");
    }, [filters]);

    const [minimised, setMinimised] = useState<string[]>([]);

    return (
        <>
            {filterGroups.map(filterGroup => {
                const { label, value } = filterGroup;

                return (
                    <Accordion
                        key={label}
                        sx={{ background: "transparent", boxShadow: "none" }}
                        expanded={!minimised.includes(label)}
                        heading={
                            <Typography fontWeight="400" fontSize="20px">
                                {capitalise(splitCamelcase(label))}
                            </Typography>
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
                                value={watch(value)}
                            />
                        }
                    />
                );
            })}
        </>
    );
};

export default FilterPanel;
