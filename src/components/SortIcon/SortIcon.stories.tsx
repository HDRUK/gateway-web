import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import SortIcon from "./SortIcon";

const meta: Meta<typeof SortIcon> = {
    component: SortIcon,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SortIcon>;

const WrapperComponent = () => {
    const [sort, setSort] = useState({ key: "created_at", direction: "asc" });

    return (
        <SortIcon
            setSort={setSort}
            sort={sort}
            sortKey="mockKey"
            ariaLabel="mockAriaLabel"
        />
    );
};

export const Group: Story = {
    render: () => <WrapperComponent />,
};
