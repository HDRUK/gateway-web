import mockRouter from "next-router-mock";
import { FederationTestStatus } from "@/interfaces/Federation";
import { screen, render, act, waitFor, fireEvent } from "@/utils/testUtils";
import { integrationV1 } from "@/mocks/data/integration";
import { teamV1 } from "@/mocks/data/team";
import {
    getFederationRunV1,
    getIntegrationV1,
} from "@/mocks/handlers/integration";
import { server } from "@/mocks/server";
import EditIntegrationForm from "./EditIntegrationForm";

jest.mock("@/hooks/useTestFederation", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        testStatus: FederationTestStatus.TESTED_IS_TRUE,
        testResponse: undefined,
        setTestedConfig: jest.fn(),
        handleTest: jest.fn(),
    })),
    watchFederationKeys: [
        "auth_type",
        "auth_secret_key",
        "endpoint_baseurl",
        "endpoint_datasets",
        "endpoint_dataset",
        "run_time_hour",
        "notifications",
    ],
}));

describe("EditIntegrationForm", () => {
    mockRouter.query = { teamId: teamV1.id.toString(), intId: "2" };
    it("should disable federation dropdown", async () => {
        await act(() => render(<EditIntegrationForm />));
        const allSelects = screen.getAllByRole("combobox");
        expect(allSelects[0]).toHaveClass("Mui-disabled");
    });

    it("should show an error alert with the failure reason when the integration has failed", async () => {
        const mockIntegration = {
            ...integrationV1,
            id: 2,
            error: true,
            error_text: "Connection timed out",
        };
        server.use(getIntegrationV1({ data: mockIntegration }));

        await act(() => render(<EditIntegrationForm />));

        expect(
            await screen.findByText("Connection timed out")
        ).toBeInTheDocument();
    });

    it("should not show an error alert when the integration has not failed", async () => {
        const mockIntegration = {
            ...integrationV1,
            id: 2,
            error: false,
            error_text: null,
        };
        server.use(getIntegrationV1({ data: mockIntegration }));

        await act(() => render(<EditIntegrationForm />));

        expect(
            await screen.findByDisplayValue(mockIntegration.endpoint_baseurl)
        ).toBeInTheDocument();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("should run the 'Run now' button through Run now -> Running -> Complete -> Run now", async () => {
        const mockIntegration = {
            ...integrationV1,
            id: 2,
            federation_type: "DATASETS" as const,
            enabled: true,
            tested: true,
            run_time_hour: 12,
            run_time_minute: "30",
        };
        server.use(
            getIntegrationV1({ data: mockIntegration }),
            getFederationRunV1({ federationId: 2 })
        );

        await act(() => render(<EditIntegrationForm />));

        const runNowButton = await waitFor(() => {
            const button = screen.getByRole("button", { name: "Run now" });
            expect(button).not.toBeDisabled();
            return button;
        });

        fireEvent.click(runNowButton);

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: /Running/ })
            ).toBeDisabled();
        });

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Complete" })
            ).toBeInTheDocument();
        });

        await waitFor(
            () => {
                expect(
                    screen.getByRole("button", { name: "Run now" })
                ).toBeInTheDocument();
            },
            { timeout: 4000 }
        );
    }, 10000);
});
