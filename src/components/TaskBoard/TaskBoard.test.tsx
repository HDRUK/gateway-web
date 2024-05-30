import React, { useState } from "react";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import TaskBoard from "@/components/TaskBoard";
import { TaskBoardSectionProps } from "@/components/TaskBoardSection/TaskBoardSection";
import { render, screen } from "@/utils/testUtils";

describe("TaskBoardSection", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = () => {
        const [boardSections, setBoardSections] = useState<
            TaskBoardSectionProps[]
        >([
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
                                <Box> First Item Board 1</Box>
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
        ]);

        return (
            <TaskBoard
                boardSections={boardSections}
                setBoardSections={setBoardSections}
            />
        );
    };

    it("should render two boards", async () => {
        render(<Component />);
        expect(screen.getByText("This is board 1")).toBeInTheDocument();
        expect(screen.getByText("This is board 2")).toBeInTheDocument();
    });

    it("should render tasks", async () => {
        render(<Component />);

        expect(screen.getByText("First Item Board 1")).toBeInTheDocument();
        expect(screen.getByText("Second Item Board 1")).toBeInTheDocument();

        expect(screen.getByText("First Item Board 2")).toBeInTheDocument();
        expect(screen.getByText("Second Item Board 2")).toBeInTheDocument();
    });
});
