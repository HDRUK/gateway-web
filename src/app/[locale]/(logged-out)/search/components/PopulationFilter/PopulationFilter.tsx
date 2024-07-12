"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Aggregations } from "@/interfaces/Search";
import BarSlider from "@/components/BarSlider";
import Box from "@/components/Box";
import CheckboxControlled from "@/components/CheckboxControlled";
import Typography from "@/components/Typography";
import { INCLUDE_UNREPORTED } from "@/consts/filters";

const TRANSLATION_PATH = "pages.search.components.PopulationFilter";
const UNREPORTED = "Unreported";

interface PopulationFilterProps {
    aggregations?: Aggregations;
    selectedFilters: { [filter: string]: string[] | undefined };
    handleUpdate: (
        populationSize?: number[],
        includeUnreported?: boolean
    ) => void;
}

const PopulationFilter = ({
    aggregations,
    selectedFilters,
    handleUpdate,
}: PopulationFilterProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const unreportedCount = useMemo(() => {
        return (
            aggregations?.populationSize?.buckets
                ?.filter(bucket => bucket.key === UNREPORTED)
                .flatMap(bucket => bucket.doc_count)[0] || 0
        );
    }, [aggregations?.populationSize?.buckets]);

    const formattedData = useMemo(() => {
        const populationSizeBuckets =
            aggregations?.populationSize?.buckets?.filter(
                bucket => bucket.key !== UNREPORTED
            );

        return (
            populationSizeBuckets &&
            populationSizeBuckets?.map(bucket => ({
                xValue: [bucket.from, bucket.to],
                yValue: bucket.doc_count,
            }))
        );
    }, [aggregations?.populationSize?.buckets]);

    const defaultLeftStartPoint = !Number.isNaN(
        Number(selectedFilters?.populationSize?.[0])
    )
        ? selectedFilters?.populationSize?.[0]
        : undefined;

    const defaultRightStartPoint = !Number.isNaN(
        Number(selectedFilters?.populationSize?.[1])
    )
        ? selectedFilters?.populationSize?.[1]
        : undefined;

    let leftIndex;
    let rightIndex;

    if (defaultLeftStartPoint) {
        const foundIndex = formattedData?.findIndex(
            data => data?.xValue[0]?.toString() === defaultLeftStartPoint
        );
        leftIndex = foundIndex !== -1 ? foundIndex : formattedData?.length;
    }

    if (defaultRightStartPoint) {
        const foundIndex = formattedData?.findIndex(
            data => data?.xValue[1]?.toString() === defaultRightStartPoint
        );
        rightIndex = foundIndex && foundIndex !== -1 ? foundIndex + 1 : 0;
    }

    return (
        <>
            <BarSlider
                leftStartPoint={leftIndex}
                rightStartPoint={rightIndex}
                step={1}
                data={formattedData}
                ariaLabel="Dataset Population"
                height={132}
                handleRangeChange={newRange => {
                    const [lowerRange, upperRange] = newRange as number[];

                    const lowerRangeValue =
                        lowerRange !== upperRange
                            ? formattedData?.[lowerRange]?.xValue[0]
                            : formattedData?.[lowerRange - 1]?.xValue[1] || 1;
                    const upperRangeValue =
                        lowerRange !== upperRange
                            ? formattedData?.[upperRange - 1]?.xValue[1]
                            : formattedData?.[lowerRange - 1]?.xValue[1] || 1;

                    handleUpdate([lowerRangeValue, upperRangeValue]);
                }}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    p: 0,
                }}>
                <Typography>{formattedData?.[0].xValue?.[0]}</Typography>
                <Typography>
                    {formattedData?.[
                        formattedData.length - 1
                    ]?.xValue?.[1]?.toLocaleString()}
                    +
                </Typography>
            </Box>
            <CheckboxControlled
                formControlSx={{ pl: 1, pr: 1 }}
                label={t(INCLUDE_UNREPORTED, { unreportedCount })}
                checked={
                    !!selectedFilters?.populationSize?.includes(
                        INCLUDE_UNREPORTED
                    )
                }
                name="dataset-population-checkbox"
                onChange={(event, value) => handleUpdate(undefined, value)}
            />
        </>
    );
};

export default PopulationFilter;
