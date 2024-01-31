"use client";

import { Control, useController } from "react-hook-form";
import { useTranslations } from "next-intl";
import { FilterType } from "@/interfaces/Filter";
import CheckboxGroup from "@/components/CheckboxGroup";
import ScrollContent from "@/components/ScrollContent";
import TextField from "@/components/TextField";
import Typography from "@/components/Typography";
import { SearchIcon } from "@/consts/icons";

interface FilterSectionProps {
    filterItems: { label: string; value: string }[];
    control: Control;
    filterSection: FilterType;
    noFilterLabel?: string;
    placeholder?: string;
    setValue: (name: FilterType, value: string | number) => void;
}
const FilterSection = ({
    filterItems,
    filterSection,
    control,
    noFilterLabel,
    placeholder,
    setValue,
}: FilterSectionProps) => {
    const { field } = useController({ control, name: filterSection });
    const t = useTranslations("components.FilterSection");
    if (!filterItems)
        return <Typography>{noFilterLabel || t("noFilters")}</Typography>;

    return (
        <>
            <TextField
                control={control}
                name={filterSection}
                label=""
                placeholder={placeholder || t("placeholder")}
                icon={SearchIcon}
                showClearButton
                setValue={setValue}
            />
            <ScrollContent sx={{ height: 110, pt: 0 }}>
                <CheckboxGroup
                    direction="column"
                    name="filters"
                    label=""
                    size="large"
                    control={control}
                    checkboxes={filterItems.filter(filterItem =>
                        filterItem.label.includes(field.value || "")
                    )}
                    formControlSx={{ mb: 0 }}
                    checkboxSx={{ p: "4px" }}
                />
            </ScrollContent>
        </>
    );
};

export default FilterSection;
