"use client";

import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import dayjs, { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { DateRange } from "@/interfaces/Filter";
import { Aggregations } from "@/interfaces/Search";
import DatePickerControlled from "@/components/DatePickerControlled";
import { FILTER_DATE_RANGE } from "@/config/forms/filters";
import { SearchIcon } from "@/consts/icons";
import { yearToDayJsDate } from "@/utils/date";
import { DateFilterWrapper, DateError } from "./DateRangeFilter.styles";

const TRANSLATION_PATH = "pages.search.components.DateRangeFilter";
const MIN_YEAR_FIELD = "minYear";
const MAX_YEAR_FIELD = "maxYear";

interface DateRangeFilterProps {
    aggregations?: Aggregations;
    selectedFilters: { [filter: string]: string[] | undefined };
    handleUpdate: (dateRange: DateRange) => void;
}

const filterToDateRangeState = (filterVals: string[] | undefined) => {
    return {
        [MIN_YEAR_FIELD]: filterVals?.[0] || "",
        [MAX_YEAR_FIELD]: filterVals?.[1] || "",
    };
};

const DateRangeFilter = ({
    aggregations,
    selectedFilters,
    handleUpdate,
}: DateRangeFilterProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const [dateRange, setDateRange] = useState<DateRange>({
        [MIN_YEAR_FIELD]: "",
        [MAX_YEAR_FIELD]: "",
    });

    const [minYearError, setMinYearError] = useState<string | null>();
    const [maxYearError, setMaxYearError] = useState<string | null>();

    useEffect(() => {
        setDateRange(
            selectedFilters[FILTER_DATE_RANGE]
                ? filterToDateRangeState(selectedFilters[FILTER_DATE_RANGE])
                : {
                      [MIN_YEAR_FIELD]: "",
                      [MAX_YEAR_FIELD]: "",
                  }
        );
    }, [selectedFilters]);

    const updateDateRange = (type: string, newDate: Dayjs | null) => {
        setDateRange({
            ...dateRange,
            [type]: newDate?.year()?.toString() || "",
        });
    };

    const startDate = aggregations?.startDate?.value_as_string;
    const endDate = aggregations?.endDate?.value_as_string;

    const defaultMinDate = dateRange.minYear
        ? yearToDayJsDate(dateRange.minYear)
        : null;

    const defaultMaxDate = dateRange.maxYear
        ? yearToDayJsDate(dateRange.maxYear)
        : null;

    return (
        <>
            <DateFilterWrapper>
                <DatePickerControlled
                    formControlSx={{ mb: 0, maxWidth: "140px" }}
                    sx={{ mt: 0 }}
                    label=""
                    name={MIN_YEAR_FIELD}
                    views={["year"]}
                    format="YYYY"
                    minDate={dayjs(startDate)}
                    maxDate={dayjs(dateRange.maxYear || endDate)}
                    slotProps={{
                        field: {
                            clearable: true,
                        },
                    }}
                    onError={error => setMinYearError(error)}
                    onChange={(newValue: Dayjs | null) =>
                        updateDateRange(MIN_YEAR_FIELD, newValue)
                    }
                    value={defaultMinDate}
                />
                {` ${t("to")} `}
                <DatePickerControlled
                    formControlSx={{ mb: 0, maxWidth: "140px" }}
                    sx={{ mt: 0 }}
                    label=""
                    name={MAX_YEAR_FIELD}
                    views={["year"]}
                    format="YYYY"
                    minDate={dayjs(startDate)}
                    maxDate={dayjs(endDate)}
                    onError={error => setMaxYearError(error)}
                    onChange={(newValue: Dayjs | null) =>
                        updateDateRange(MAX_YEAR_FIELD, newValue)
                    }
                    slotProps={{
                        field: {
                            clearable: true,
                        },
                    }}
                    value={defaultMaxDate}
                />
                <IconButton
                    size="large"
                    edge="start"
                    onClick={() => handleUpdate(dateRange)}
                    disabled={!!minYearError || !!maxYearError}>
                    <SearchIcon />
                </IconButton>
            </DateFilterWrapper>

            {minYearError === "maxDate" && (
                <DateError error>{t("minYearErrorMessage")}</DateError>
            )}
        </>
    );
};

export default DateRangeFilter;
