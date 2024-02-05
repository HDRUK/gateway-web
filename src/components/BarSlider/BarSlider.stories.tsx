import type { Meta, StoryObj } from "@storybook/react";
import BarSlider from "./BarSlider";

const mockData = [
    { xValue: [0, 1000.0], yValue: 3 },
    { xValue: [1000.0, 2000.0], yValue: 24 },
    { xValue: [2000.0, 3000.0], yValue: 43 },
    { xValue: [3000.0, 4000.0], yValue: 34 },
    { xValue: [4000.0, 5000.0], yValue: 7 },
    { xValue: [5000.0, 6000.0], yValue: 62 },
    { xValue: [6000.0, 7000.0], yValue: 3 },
    { xValue: [7000.0, 8000.0], yValue: 93 },
    { xValue: [8000.0, 9000.0], yValue: 23 },
    { xValue: [9000.0, 10000.0], yValue: 63 },
];

const meta: Meta<typeof BarSlider> = {
    component: BarSlider,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof BarSlider>;

export const Default: Story = {
    args: {
        step: 1000,
        data: mockData,
        ariaLabel: "Dataset Population",
        height: 130,
        handleRangeChange: newRange => console.log(newRange),
        handleBarClick: clickedBar => console.log(clickedBar),
    },
};
