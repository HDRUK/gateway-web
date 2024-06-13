import React from "react";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import TaskBoardSection from "@/components/TaskBoardSection";
import { render, screen } from "@/utils/testUtils";

describe("TaskBoardSection", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = () => {
        const tasks = [
            {
                id: "101",
                content: (
                    <Paper>
                        <Box> First Item</Box>
                    </Paper>
                ),
            },
            {
                id: "102",
                content: (
                    <Paper>
                        <Box> Second Item</Box>
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

    it("should render title and description", async () => {
        render(<Component />);
        expect(screen.getByText("my title")).toBeInTheDocument();
        expect(screen.getByText("my description")).toBeInTheDocument();
    });

    it("should render tasks", async () => {
        render(<Component />);

        expect(screen.getByText("First Item")).toBeInTheDocument();
        expect(screen.getByText("Second Item")).toBeInTheDocument();
    });
});
