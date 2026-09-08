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

    it("should not discard an unsaved edit when the record is refetched mid-edit (e.g. after running a test)", async () => {
        // Regression test for the "Save configuration" button appearing to
        // do nothing after editing a field: the form-population effect used
        // to call reset() on every refetch of `integration`, even while the
        // user still had unsaved changes, silently reverting them back to
        // the last-saved server values before the user ever clicked Save.
        const baseIntegration = makeFailingIntegration();
        server.use(getIntegrationV1({ data: baseIntegration }));

        await act(() => render(<EditIntegrationForm />));

        const baseUrlInput = await screen.findByDisplayValue(
            baseIntegration.endpoint_baseurl
        );

        fireEvent.change(baseUrlInput, {
            target: { value: "https://edited-not-yet-saved.example.com" },
        });

        expect(
            screen.getByDisplayValue(
                "https://edited-not-yet-saved.example.com"
            )
        ).toBeInTheDocument();

        // Refetching the record (as happens after running a test) returns
        // genuinely different data - the backend clears the stale error -
        // which is exactly what previously triggered the form-wide reset().
        server.use(
            getIntegrationV1({
                data: { ...baseIntegration, error: false, error_text: null },
            })
        );

        const testButton = screen.getByRole("button", { name: "Run test" });
        await act(async () => {
            fireEvent.click(testButton);
        });

        await waitFor(() => {
            expect(
                screen.queryByText("Connection timed out")
            ).not.toBeInTheDocument();
        });

        expect(
            screen.getByDisplayValue(
                "https://edited-not-yet-saved.example.com"
            )
        ).toBeInTheDocument();
    });

    it("should re-sync the form and clear isDirty after a successful save", async () => {
        // The unsaved-edit guard above must not get stuck: once a save
        // actually succeeds, the subsequent refetch should still reset()
        // the form (re-baselining to the newly-persisted values), otherwise
        // 'formState.isDirty' would remain permanently true - re-disabling
        // "Run now" and re-triggering the leave-page warning even though
        // there is nothing left unsaved.
        const failingIntegration = makeFailingIntegration();
        const fixedIntegration = {
            ...failingIntegration,
            endpoint_baseurl: "https://saved.example.com",
            error: false,
            error_text: null,
        };
        server.use(getIntegrationV1({ data: failingIntegration }));

        await act(() => render(<EditIntegrationForm />));

        const baseUrlInput = await screen.findByDisplayValue(
            failingIntegration.endpoint_baseurl
        );
        fireEvent.change(baseUrlInput, {
            target: { value: "https://saved.example.com" },
        });

        server.use(
            rest.put(
                `${apis.teamsV1Url}/${teamV1.id}/federations/${failingIntegration.id}`,
                (req, res, ctx) =>
                    res(ctx.status(200), ctx.json({ data: fixedIntegration }))
            ),
            getIntegrationV1({ data: fixedIntegration })
        );

        await act(async () => {
            fireEvent.click(
                screen.getByRole("button", { name: "Save configuration" })
            );
        });

        const runNowButton = await waitFor(() => {
            const button = screen.getByRole("button", { name: "Run now" });
            expect(button).not.toBeDisabled();
            return button;
        });
        expect(runNowButton).toBeInTheDocument();
    });

    it("should keep 'Run test' usable after saving a NO_AUTH integration whose auth_secret_key is null", async () => {
        // Regression test: a NO_AUTH integration legitimately has no secret
        // key, so the backend returns `auth_secret_key: null`. The yup
        // schema's base `auth_secret_key` type was a plain (non-nullable)
        // string, so validating this record threw a raw yup type error
        // ("auth_secret_key cannot be null") instead of a normal per-field
        // validation error - @hookform/resolvers/yup surfaces that as
        // formState.isValid === false with an EMPTY errors object, since the
        // thrown error's `.inner` doesn't map cleanly onto a field path.
        // That left "Run test" permanently disabled with "you must complete
        // the required fields" after every save, even though every field
        // was actually filled in correctly.
        const noAuthIntegration = {
            ...makeFailingIntegration(),
            auth_type: "NO_AUTH" as const,
            auth_secret_key: null,
            error: false,
            error_text: null,
        };
        server.use(getIntegrationV1({ data: noAuthIntegration }));

        await act(() => render(<EditIntegrationForm />));

        await screen.findByDisplayValue(noAuthIntegration.endpoint_baseurl);

        server.use(
            rest.put(
                `${apis.teamsV1Url}/${teamV1.id}/federations/${noAuthIntegration.id}`,
                (req, res, ctx) =>
                    res(ctx.status(200), ctx.json({ data: noAuthIntegration }))
            ),
            getIntegrationV1({ data: noAuthIntegration })
        );

        await act(async () => {
            fireEvent.click(
                screen.getByRole("button", { name: "Save configuration" })
            );
        });

        // "Run test"'s disabled state is driven by formState.isValid
        // regardless of testStatus (which is mocked to TESTED_IS_TRUE in
        // this file), so this is the part that actually exercises the bug.
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Run test" })
            ).not.toBeDisabled();
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
