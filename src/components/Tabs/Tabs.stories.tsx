import type { Meta } from "@storybook/react";
import TabsComponent from "@/components/Tabs";
import React, { useState } from "react";
import { TabProps } from "@mui/material";

const meta: Meta<typeof TabsComponent> = {
    component: TabsComponent,
};

export default meta;

const tabs = [
    {
        label: "2023",
        value: "2023",
        content: <div>2023 content</div>,
    },
    {
        label: "2022",
        value: "2022",
        content: <div>2022 content</div>,
    },
    {
        label: "2021",
        value: "2021",
        content: <div>2021 content</div>,
    },
    {
        label: "2020",
        value: "2020",
        content: <div>2020 content</div>,
    },
];

const DummyComponent = (props: TabProps) => {
    const [selectedTab, setSelectedTab] = useState("2023");

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
    };

    return (
        <TabsComponent
            centered
            tabs={tabs}
            {...props}
            value={selectedTab}
            onChange={handleTabChange}
        />
    );
};

export const Tabs = (args: TabProps) => <DummyComponent {...args} />;

Tabs.args = {
    tabs,
};
