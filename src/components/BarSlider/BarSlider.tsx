"use client";

import React, { useMemo } from "react";
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

    return width < 10 ? null : (
        <svg width={width} height={height}>
            <rect width={width} height={height} fill="transparent" rx={14} />
            <Group top={0}>
                {data.map(d => {
                    const [lowerRange, upperRange] = selected;
                    const isInRange =
                        d.xValue[0] >= lowerRange && d.xValue[1] <= upperRange;
                    const barWidth = xScale.bandwidth();
                    const barHeight = yMax - (yScale(d.yValue) ?? 0);
                    const barX = xScale(d.xValue[0]);
                    const barY = yMax - barHeight;
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
        rightStartPoint || Math.max(...data.map(d => d.xValue[1])),
    ]);

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

    return (
        <>
            <div style={{ height }}>
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
                sx={{ top: "-13px" }}
                step={step}
                marks
                getAriaLabel={() => ariaLabel || ""}
                value={selected}
                size={sliderSize}
                max={Math.max(...data.map(d => d.xValue[1]))}
                onChange={onChange}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
            />
        </>
    );
};

export default BarSliderContainer;
