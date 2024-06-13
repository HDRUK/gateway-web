import type { Meta, StoryObj } from "@storybook/react";
import DatasetStatCard from "./DatasetStatCard";

const meta: Meta<typeof DatasetStatCard> = {
    component: DatasetStatCard,
    title: "Cards/DatasetStatCard",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DatasetStatCard>;

export const Default: Story = {
    args: {
        title: "Population size",
        stat: "< 23",
        unit: "days",
        iconSrc: "/images/dataset/clock-white.svg",
    },
};
