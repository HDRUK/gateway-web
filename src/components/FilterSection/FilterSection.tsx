"use client";

import { Control, useController } from "react-hook-form";
import { useTranslations } from "next-intl";
import { BucketCheckbox } from "@/interfaces/Filter";
import CheckboxGroup from "@/components/CheckboxGroup";
import ScrollContent from "@/components/ScrollContent";
import TextField from "@/components/TextField";
import Typography from "@/components/Typography";
import { SearchIcon } from "@/consts/icons";

interface FilterSectionProps {
    filterItems: { label: string; value: string; buckets: BucketCheckbox[] };
    control: Control;
    filterSection: string;
    noFilterLabel?: string;
    placeholder?: string;
    setValue: (name: string, value: string | number) => void;
}
const FilterSection = ({
    filterItems,
    filterSection,
    control,
    noFilterLabel,
    placeholder,
    setValue,
}: FilterSectionProps) => {
    const { field } = useController({
        control,
        name: `${filterSection}.input`,
    });
    const t = useTranslations("components.FilterSection");
    if (!filterItems.buckets.length)
        return <Typography>{noFilterLabel || t("noFilters")}</Typography>;

    return (
        <>
            <TextField
                control={control}
                name={`${filterSection}.input`}
                label=""
                placeholder={placeholder || t("placeholder")}
                icon={SearchIcon}
                showClearButton
                setValue={setValue}
            />
            <ScrollContent sx={{ height: 110, pt: 0 }}>
                <CheckboxGroup
                    direction="column"
                    name={`${filterSection}.filters`}
                    label=""
                    size="large"
                    control={control}
                    checkboxes={filterItems.buckets.filter(filterItem =>
                        filterItem?.label
                            ?.toLowerCase()
                            ?.includes(field.value?.toLowerCase() || "")
                    )}
                    formControlSx={{ mb: 0 }}
                    checkboxSx={{ p: "4px" }}
                />
            </ScrollContent>
        </>
    );
};

export default FilterSection;
