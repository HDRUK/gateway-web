import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import TaskBoard from "@/components/TaskBoard";
import { TaskBoardSectionProps } from "../TaskBoardSection/TaskBoardSection";

/** Mui documentation: https://mui.com/material-ui/react-tabs */

const meta: Meta<typeof TaskBoard> = {
    component: TaskBoard,
    tags: ["autodocs"],
};

export default meta;

const WrapperComponent = () => {
    const [boardSections, setBoardSections] = useState<TaskBoardSectionProps[]>(
        [
            {
                id: "board1",
                title: "Board 1",
                description: "This is board 1",
                tasks: [
                    {
                        id: "101",
                        anchored: true,
                        content: (
                            <Paper>
                                <Box> First Item Board 1 </Box>
                            </Paper>
                        ),
                    },
                    {
                        id: "102",
                        content: (
                            <Paper>
                                <Box> Second Item Board 1</Box>
                            </Paper>
                        ),
                    },
                ],
            },
            {
                id: "board2",
                title: "Board 2",
                description: "This is board 2",
                tasks: [
                    {
                        id: "111",
                        content: (
                            <Paper>
                                <Box> First Item Board 2</Box>
                            </Paper>
                        ),
                    },
                    {
                        id: "112",
                        content: (
                            <Paper>
                                <Box> Second Item Board 2</Box>
                            </Paper>
                        ),
                    },
                    {
                        id: "113",
                        content: (
                            <Paper>
                                <Box> Third Item Board 3</Box>
                            </Paper>
                        ),
                    },
                ],
            },
        ]
    );

    return (
        <TaskBoard
            boardSections={boardSections}
            setBoardSections={setBoardSections}
        />
    );
};

type Story = StoryObj<typeof TaskBoard>;

export const Default: Story = {
    render: () => <WrapperComponent />,
};
