"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Filter } from "@/interfaces/Filter";
import Accordion from "@/components/Accordion";
import FilterSection from "@/components/FilterSection";
import Tooltip from "@/components/Tooltip";
import Typography from "@/components/Typography";
import { filtersList } from "@/config/forms/filters";
import { groupByType, transformQueryFiltersToForm } from "@/utils/filters";

const TRANSLATION_PATH = "pages.search.components.FilterPanel";
const TOOLTIP_SUFFIX = "Tooltip";

const FilterPanel = ({
    filters,
    setFilterQueryParams,
}: {
    filters: Filter[];
    setFilterQueryParams: (
        params: {
            [key: string]: string[];
        },
        filterSection: string
    ) => void;
}) => {
    const t = useTranslations(TRANSLATION_PATH);
    const searchParams = useSearchParams();
    const [checkboxValues, setCheckboxValues] = useState({
        publisherName: transformQueryFiltersToForm(
            searchParams?.get("publisherName")
        ),
        dataUseTitles: transformQueryFiltersToForm(
            searchParams?.get("dataUseTitles")
        ),
    });
    const { control, setValue } = useForm({
        defaultValues: {
            publisherName: "",
            dataUseTitles: "",
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
            ...checkboxValues,
            [filterSection]: {
                ...(checkboxValues[filterSection] || {}),
                ...updatedCheckbox,
            },
        };

        const obj = {};

        Object.keys(allUpdates).forEach(key => {
            obj[key] = Object.entries(allUpdates[key])
                .filter(([, value]) => value === true)
                .map(([key]) => key);
        });

        setCheckboxValues(allUpdates);
        setFilterQueryParams(obj, filterSection);
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
                        contents={
                            <FilterSection
                                handleCheckboxChange={updates =>
                                    updateCheckboxes(updates, label)
                                }
                                checkboxValues={checkboxValues[label]}
                                filterSection={label}
                                setValue={setValue}
                                control={control}
                                filterItem={filterItem}
                            />
                        }
                    />
                );
            })}
        </>
    );
};

export default FilterPanel;
