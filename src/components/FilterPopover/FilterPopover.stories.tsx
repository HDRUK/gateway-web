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

const WrapperComponent = () => {
    const [filter, setFilter] = useState<string>("ALL");

    return (
        <FilterPopover
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
