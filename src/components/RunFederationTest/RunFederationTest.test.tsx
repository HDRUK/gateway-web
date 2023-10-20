import { render, screen, waitFor } from "@/utils/testUtils";
import { integrationV1 } from "@/mocks/data/integration";
import { server } from "@/mocks/server";
import { postFederationsTestV1 } from "@/mocks/handlers/integration";
import RunFederationTest from "./RunFederationTest";

describe("RunFederationTest", () => {
    const onRun = jest.fn();

    it("should render info message when component is not enabled", async () => {
        render(
            <RunFederationTest
                integration={integrationV1}
                onRun={onRun}
                teamId={1}
                isEnabled={false}
            />
        );

        const disabledMessage = screen.getByText(
            "You must complete the required fields before running a test"
        );
        const runTestButton = screen.getByText("Run test");

        expect(disabledMessage).toBeInTheDocument();
        expect(runTestButton).toBeDisabled();
    });

    it("should render loading message when isRunning is true", async () => {
        render(
            <RunFederationTest
                integration={integrationV1}
                teamId={1}
                onRun={onRun}
                isEnabled
            />
        );

        const runTestButton = screen.getByText("Run test");

        runTestButton.click();

        await waitFor(() => {
            const loadingText = screen.getByText("Testing API connection link");
            expect(loadingText).toBeInTheDocument();
        });
    });

    it("should render error message when runResponse is not successful", async () => {
        const runResponse = {
            message: false,
            status: 404,
            title: "Test failed",
        };

        server.use(postFederationsTestV1({ data: runResponse }));
        render(
            <RunFederationTest
                integration={integrationV1}
                teamId={1}
                onRun={onRun}
                isEnabled
            />
        );

        const runTestButton = screen.getByText("Run test");
        runTestButton.click();

        await waitFor(() => {
            const completeText = screen.getAllByText("Complete");
            const errorText = screen.getByText("Failed");
            const errorMessage = screen.getByText(
                "The test has come back with a (404) error"
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
            message: true,
        };
        server.use(postFederationsTestV1({ data: runResponse }));
        render(
            <RunFederationTest
                integration={integrationV1}
                teamId={1}
                onRun={onRun}
                isEnabled
            />
        );

        const runTestButton = screen.getByText("Run test");
        runTestButton.click();

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
