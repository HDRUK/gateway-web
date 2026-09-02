import { rest } from "msw";
import mockRouter from "next-router-mock";
import { FederationTestStatus } from "@/interfaces/Federation";
import { screen, render, act, waitFor, fireEvent } from "@/utils/testUtils";
import apis from "@/config/apis";
import { integrationV1 } from "@/mocks/data/integration";
import { teamV1 } from "@/mocks/data/team";
import {
    getFederationRunV1,
    getIntegrationV1,
} from "@/mocks/handlers/integration";
import { server } from "@/mocks/server";
import EditIntegrationForm from "./EditIntegrationForm";

jest.mock("notistack", () => ({
    ...jest.requireActual("notistack"),
    enqueueSnackbar: jest.fn(),
    __esModule: true,
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
jest.mock("@/hooks/useTestFederation", () => ({
    __esModule: true,
    default: jest.fn((props: { setValue: (name: string, value: unknown) => void }) => ({
        testStatus: FederationTestStatus.TESTED_IS_TRUE,
        testResponse: undefined,
        setTestedConfig: jest.fn(),
        // Mirrors what the real hook does on a successful test: flip the
        // form's local `tested` value to true, without touching the backend.
        handleTest: jest.fn(async () => {
            props.setValue("tested", true);
        }),
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

    const makeFailingIntegration = () => ({
        ...integrationV1,
        id: 2,
        federation_type: "DATASETS" as const,
        endpoint_baseurl: "https://example.com",
        endpoint_datasets: "/datasets",
        endpoint_dataset: "/datasets/{id}",
        enabled: true,
        tested: true,
        notifications: [
            {
                id: 1,
                opt_in: 0,
                message: "",
                email: "",
                enabled: true,
                notification_type: "federation",
                user_id: 1,
            },
        ],
        error: true,
        error_text: "Connection timed out",
    });

    it("should clear the error alert after running a test", async () => {
        const failingIntegration = makeFailingIntegration();
        const fixedIntegration = {
            ...failingIntegration,
            error: false,
            error_text: null,
        };
        server.use(getIntegrationV1({ data: failingIntegration }));

        await act(() => render(<EditIntegrationForm />));

        expect(
            await screen.findByText("Connection timed out")
        ).toBeInTheDocument();

        server.use(getIntegrationV1({ data: fixedIntegration }));

        const testButton = await waitFor(() => {
            const button = screen.getByRole("button", { name: "Run test" });
            expect(button).not.toBeDisabled();
            return button;
        });

        fireEvent.click(testButton);

        await waitFor(() => {
            expect(
                screen.queryByText("Connection timed out")
            ).not.toBeInTheDocument();
        });
    });

    it("should clear the error alert after saving the integration", async () => {
        const failingIntegration = makeFailingIntegration();
        const fixedIntegration = {
            ...failingIntegration,
            error: false,
            error_text: null,
        };
        server.use(getIntegrationV1({ data: failingIntegration }));

        await act(() => render(<EditIntegrationForm />));

        expect(
            await screen.findByText("Connection timed out")
        ).toBeInTheDocument();

        server.use(
            rest.put(
                `${apis.teamsV1Url}/${teamV1.id}/federations/${failingIntegration.id}`,
                (req, res, ctx) =>
                    res(ctx.status(200), ctx.json({ data: fixedIntegration }))
            ),
            getIntegrationV1({ data: fixedIntegration })
        );

        fireEvent.click(
            screen.getByRole("button", { name: "Save configuration" })
        );

        await waitFor(() => {
            expect(
                screen.queryByText("Connection timed out")
            ).not.toBeInTheDocument();
        });
    });

    it("should clear the error alert after running 'Run now'", async () => {
        const failingIntegration = makeFailingIntegration();
        const fixedIntegration = {
            ...failingIntegration,
            error: false,
            error_text: null,
        };
        server.use(
            getIntegrationV1({ data: failingIntegration }),
            getFederationRunV1({ federationId: failingIntegration.id })
        );

        await act(() => render(<EditIntegrationForm />));

        expect(
            await screen.findByText("Connection timed out")
        ).toBeInTheDocument();

        server.use(getIntegrationV1({ data: fixedIntegration }));

        const runNowButton = await waitFor(() => {
            const button = screen.getByRole("button", { name: "Run now" });
            expect(button).not.toBeDisabled();
            return button;
        });

        fireEvent.click(runNowButton);

        await waitFor(() => {
            expect(
                screen.queryByText("Connection timed out")
            ).not.toBeInTheDocument();
        });
    });

    it("should keep the enabled toggle usable after a successful test, even though the test endpoint doesn't persist 'tested'", async () => {
        const baseIntegration = {
            ...integrationV1,
            id: 2,
            federation_type: "DATASETS" as const,
            endpoint_baseurl: "https://example.com",
            endpoint_datasets: "/datasets",
            endpoint_dataset: "/datasets/{id}",
            tested: false,
            enabled: false,
            notifications: [
                {
                    id: 1,
                    opt_in: 0,
                    message: "",
                    email: "",
                    enabled: true,
                    notification_type: "federation",
                    user_id: 1,
                },
            ],
        };
        // Starts with a stale prior-failure error, like the real record
        // would have before the user re-runs the test.
        const untestedIntegration = {
            ...baseIntegration,
            error: true,
            error_text: "Connection timed out",
        };
        server.use(getIntegrationV1({ data: untestedIntegration }));

        const { container } = await act(() => render(<EditIntegrationForm />));

        const getToggle = () =>
            container.querySelector<HTMLInputElement>('input[name="enabled"]');

        await waitFor(() => expect(getToggle()).not.toBeNull());
        expect(getToggle()).toBeDisabled();

        const testButton = await waitFor(() => {
            const button = screen.getByRole("button", { name: "Run test" });
            expect(button).not.toBeDisabled();
            return button;
        });

        // The backend clears error/error_text on a successful test, but -
        // crucially - never persists `tested`, so the refetch triggered by
        // the test still comes back with `tested: false`.
        server.use(
            getIntegrationV1({
                data: { ...baseIntegration, error: false, error_text: null },
            })
        );

        await act(async () => {
            fireEvent.click(testButton);
        });

        await waitFor(() => {
            expect(getToggle()).not.toBeDisabled();
        });
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
