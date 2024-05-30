"use client";

import React, { useEffect, useMemo } from "react";
import Slider from "@mui/material/Slider";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import theme from "@/config/theme";

type dataType = { yValue: number; xValue: number[] };

interface BarsProps {
    width: number;
    height: number;
    selected: number[];
    data: dataType[];
    handleEvent?: (d: dataType) => void;
}

function valuetext(value: number) {
    return `${value}°C`;
}

const BarSlider = ({
    data,
    width,
    height,
    selected,
    handleEvent,
}: BarsProps) => {
    // bounds
    const xMax = width;
    const yMax = height;

    // scales, memoize for performance
    const xScale = useMemo(
        () =>
            scaleBand<number>({
                range: [0, xMax],
                round: true,
                domain: data.map(d => d.xValue[0]),
                padding: 0.1,
            }).paddingOuter(0),
        [data, xMax]
    );
    const yScale = useMemo(
        () =>
            scaleLinear<number>({
                range: [yMax, 0],
                round: true,
                domain: [0, Math.max(...data.map(d => d.yValue))],
            }),
        [data, yMax]
    );

    const getIsInRange = (d: dataType) => {
        const [lowerRange, upperRange] = selected;
        const lowerRangeValue = data[lowerRange]?.xValue[0];
        const upperRangeValue = data[upperRange - 1]?.xValue[1];

        return d.xValue[0] >= lowerRangeValue && d.xValue[1] <= upperRangeValue;
    };

    const getBarData = (d: dataType) => {
        const barWidth = xScale.bandwidth();
        const barHeight = yMax - (yScale(d.yValue) ?? 0);
        const barX = xScale(d.xValue[0]);
        const barY = yMax - barHeight;
        return { barWidth, barHeight, barX, barY };
    };

    return width < 10 ? null : (
        <svg width={width} height={height}>
            <rect width={width} height={height} fill="transparent" rx={14} />
            <Group top={0}>
                {data.map(d => {
                    const isInRange = getIsInRange(d);
                    const { barWidth, barHeight, barX, barY } = getBarData(d);
                    return (
                        <Bar
                            key={`bar-${d.xValue[0]}`}
                            x={barX}
                            y={barY}
                            opacity={isInRange ? 1 : 0.5}
                            width={barWidth}
                            height={barHeight}
                            fill={theme.palette.primary.main}
                            onClick={() => {
                                if (typeof handleEvent === "function") {
                                    handleEvent(d);
                                }
                            }}
                        />
                    );
                })}
            </Group>
        </svg>
    );
};

interface BarSliderContainerProps {
    height?: number;
    step: number;
    leftStartPoint?: number;
    rightStartPoint?: number;
    data: dataType[];
    handleRangeChange?: (range: number[] | number) => void;
    handleBarClick?: (data: dataType) => void;
    ariaLabel: string;
    sliderSize?: "small" | "medium";
}

const BarSliderContainer = ({
    height = 400,
    sliderSize = "small",
    leftStartPoint = 0,
    data,
    step,
    handleBarClick,
    handleRangeChange,
    ariaLabel,
    rightStartPoint,
}: BarSliderContainerProps) => {
    const [selected, setSelected] = React.useState<number[]>([
        leftStartPoint,
        rightStartPoint || data.length,
    ]);

    useEffect(() => {
        setSelected([leftStartPoint, rightStartPoint || data.length]);
    }, [data.length, leftStartPoint, rightStartPoint]);

    const onChange = (_e: Event, newValue: number[] | number) => {
        setSelected(newValue as number[]);
        if (typeof handleRangeChange === "function") {
            handleRangeChange(newValue);
        }
    };

    const onEvent = (d: dataType) => {
        if (typeof handleBarClick === "function") {
            handleBarClick(d);
        }
    };

    const valueLabelFormat = (value: number) => {
        const [, high] = data[value - 1]?.xValue || [1, 1];
        return high;
    };
    return (
        <>
            <div style={{ height, marginBottom: "-13px" }}>
                <ParentSize>
                    {({ width, height }) => (
                        <BarSlider
                            handleEvent={onEvent}
                            width={width}
                            selected={selected}
                            data={data}
                            height={height}
                        />
                    )}
                </ParentSize>
            </div>
            <Slider
                sx={{ marginBottom: "-13px" }}
                step={step}
                marks
                getAriaLabel={() => ariaLabel || ""}
                value={selected}
                size={sliderSize}
                max={data.length}
                onChange={onChange}
                valueLabelDisplay="auto"
                valueLabelFormat={valueLabelFormat}
                getAriaValueText={valuetext}
            />
        </>
    );
};

export default BarSliderContainer;
