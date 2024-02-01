import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Box from "@/components/Box";
import Tabs from "@/components/Tabs";
import { TabProps, TabVariant } from "./Tabs";

/** Mui documentation: https://mui.com/material-ui/react-tabs */

const meta: Meta<typeof Tabs> = {
    component: Tabs,
    tags: ["autodocs"],
};

export default meta;

const WrapperComponent = (
    args: Partial<TabProps & { value: string; onChange: void }>
) => {
    const [selectedTab, setSelectedTab] = useState("2023");

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
    };

    return (
        <Tabs
            tabs={["2023", "2022", "2021", "2020"].map(tab => ({
                label: tab,
                value: tab,
                content: <Box sx={{ padding: 2 }}>{tab} content</Box>,
            }))}
            centered
            value={selectedTab}
            onChange={handleTabChange}
            {...args}
        />
    );
};

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
    render: () => <WrapperComponent />,
};

export const Large: Story = {
    args: { variant: TabVariant.LARGE, renderTabContent: false },
    render: args => <WrapperComponent {...args} />,
};
