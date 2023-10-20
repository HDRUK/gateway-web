import { render, screen, waitFor } from "@/utils/testUtils";
import { integrationV1 } from "@/mocks/data/integration";
import RunFederationTest from "./RunFederationTest";

describe("RunFederationTest", () => {
    const onRun = jest.fn();

    it("should render info message when component is not enabled", async () => {
        render(
            <RunFederationTest
                integration={integrationV1}
                onRun={onRun}
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
        render(
            <RunFederationTest
                integration={integrationV1}
                onRun={onRun}
                isEnabled
            />
        );

        const runResponse = {
            success: false,
            status: 404,
            message: "Test failed",
        };

        const errorText = screen.getByText("Failed");
        const errorMessage = screen.getByText(
            "The test has come back with a (404) error"
        );
        expect(errorText).toBeInTheDocument();
        expect(errorMessage).toBeInTheDocument();
    });

    it("should render message when runResponse is successful", async () => {
        render(
            <RunFederationTest
                integration={integrationV1}
                onRun={onRun}
                isEnabled
            />
        );

        const runResponse = {
            success: true,
            status: 200,
            message: "",
        };

        const successText = screen.getByText("Complete");
        const successMessage = screen.getByText(
            "The test has come back with (0) errors"
        );
        expect(successText).toBeInTheDocument();
        expect(successMessage).toBeInTheDocument();
    });
});
