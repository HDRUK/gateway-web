"use client";

import React from "react";
import Paper from "@/components/Paper";
import BoxContainer from "@/components/BoxContainer";
import Box from "@/components/Box";
import BarSlider from "@/components/BarSlider";

import useGet from "@/hooks/useGet";
import apis from "@/config/apis";

import Loading from "@/components/Loading";

interface HistogramProps {
    field: string;
    includeZero: boolean;
    logXscale: boolean;
    logYscale: boolean;
}

const Histogram = (params: HistogramProps) => {
    const queryParams = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
    );

    const { data, isLoading } = useGet(
        `${apis.datasetsV1Url}/histogram?${queryParams}`
    );
    if (isLoading) {
        return <Loading />;
    }

    return (
        <Box sx={{ width: "500px", height: "500px" }}>
            <Paper>
                <BarSlider
                    step={params?.logXscale ? 0.1 : 1000}
                    data={data}
                    ariaLabel="Dataset Population"
                    height={400}
                />
            </Paper>
        </Box>
    );
};

const HistogramDefaultProps: HistogramProps = {
    field: "metadata.summary.populationSize",
    includeZero: false,
    logXscale: false,
    logYscale: false,
};

Histogram.defaultProps = HistogramDefaultProps;

const TestPage = () => {
    return (
        <BoxContainer sx={{ display: "flex", justifyContent: "center" }}>
            <Histogram />
            {/* <Histogram logYscale={true} logXscale={false} />
            <Histogram logYscale={true} logXscale={true} /> */}
        </BoxContainer>
    );
};

export default TestPage;
