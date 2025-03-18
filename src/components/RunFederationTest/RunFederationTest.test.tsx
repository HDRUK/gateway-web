import { render, screen, waitFor } from "@/utils/testUtils";
import RunFederationTest from "./RunFederationTest";

describe("RunFederationTest", () => {
    const onRun = jest.fn();

    it("should render `Integration tested successfully` message if component is not enabled", async () => {
        render(
            <RunFederationTest
                onRun={onRun}
                status="TESTED_IS_TRUE"
                isEnabled
                runResponse={undefined}
            />
        );

        const disabledMessage = screen.getByText(
            "Integration tested successfully"
        );
        const runTestButton = screen.getByText("Run test");

        expect(disabledMessage).toBeInTheDocument();
        expect(runTestButton).not.toBeDisabled();
    });

    it("should render 'incomplete required fields' message and disable run button", async () => {
        render(
            <RunFederationTest
                onRun={onRun}
                status="NOT_RUN"
                isEnabled={false}
                runResponse={undefined}
            />
        );

        const disabledMessage = screen.getByText(
            "You must complete the required fields before running a test"
        );
        const runTestButton = screen.getByText("Run test");

        expect(disabledMessage).toBeInTheDocument();
        expect(runTestButton).toBeDisabled();
    });

    it("should render 'test must be carried out' message if not not run", async () => {
        render(
            <RunFederationTest
                onRun={onRun}
                status="NOT_RUN"
                isEnabled
                runResponse={undefined}
            />
        );

        const disabledMessage = screen.getByText(
            "A test must be carried out before you can enable this configuration"
        );
        const runTestButton = screen.getByText("Run test");

        expect(disabledMessage).toBeInTheDocument();
        expect(runTestButton).not.toBeDisabled();
    });

    it("should render loading message when isRunning is true", async () => {
        render(
            <RunFederationTest
                onRun={onRun}
                status="IS_RUNNING"
                isEnabled
                runResponse={undefined}
            />
        );

        await waitFor(() => {
            const loadingText = screen.getByText("Testing API connection link");
            expect(loadingText).toBeInTheDocument();
        });
    });

    it("should render error message when runResponse is not successful", async () => {
        const runResponse = {
            success: false,
            status: 404,
            title: "Test failed",
        };

        render(
            <RunFederationTest
                onRun={onRun}
                status="RUN_COMPLETE"
                isEnabled
                runResponse={runResponse}
            />
        );

        await waitFor(() => {
            const completeText = screen.getAllByText("Complete");
            const errorText = screen.getByText("Failed");
            const errorMessage = screen.getByText(
                "The test has come back with an error"
            );
            expect(completeText).toHaveLength(1);
            expect(errorText).toBeInTheDocument();
            expect(errorMessage).toBeInTheDocument();
        });
    });

    it("should render message when runResponse is successful", async () => {
        const runResponse = {
            title: "",
            status: 200,
            success: true,
        };
        render(
            <RunFederationTest
                onRun={onRun}
                status="RUN_COMPLETE"
                isEnabled
                runResponse={runResponse}
            />
        );

        await waitFor(() => {
            const completeText = screen.getAllByText("Complete");
            const successMessage = screen.getByText(
                "The test has come back with (0) errors"
            );
            expect(completeText).toHaveLength(2);
            expect(successMessage).toBeInTheDocument();
        });
    });
});
