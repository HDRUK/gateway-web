import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import FilterPopover from "./FilterPopover";

const meta: Meta<typeof FilterPopover> = {
    component: FilterPopover,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FilterPopover>;

const radios = [
    { label: "All", value: "ALL" },
    { label: "Other", value: "OTHER" },
];

type radioType = "ALL" | "OTHER";

const WrapperComponent = () => {
    const [filter, setFilter] = useState<radioType>("ALL");

    return (
        <FilterPopover<radioType>
            name="filter_status"
            radios={radios}
            setFilter={setFilter}
            filter={filter}
        />
    );
};

export const Group: Story = {
    render: () => <WrapperComponent />,
};
