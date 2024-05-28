import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import TaskBoardSection from "@/components/TaskBoardSection";

/** Mui documentation: https://mui.com/material-ui/react-tabs */

const meta: Meta<typeof TaskBoardSection> = {
    component: TaskBoardSection,
    tags: ["autodocs"],
};

export default meta;

const WrapperComponent = () => {
    const tasks = [
        {
            id: "101",
            content: (
                <Paper>
                    <Box> First Item </Box>
                </Paper>
            ),
        },
        {
            id: "102",
            content: (
                <Paper>
                    <Box> Second Item </Box>
                </Paper>
            ),
        },
    ];

    return (
        <TaskBoardSection
            id="1"
            title="my title"
            description="my description"
            tasks={tasks}
        />
    );
};

type Story = StoryObj<typeof TaskBoardSection>;

export const Default: Story = {
    render: () => <WrapperComponent />,
};
