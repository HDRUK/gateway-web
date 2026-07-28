import mockRouter from "next-router-mock";
import { screen, render, waitFor, fireEvent } from "@/utils/testUtils";
import { integrationV1 } from "@/mocks/data/integration";
import { getFederationRunV1 } from "@/mocks/handlers/integration";
import { server } from "@/mocks/server";
import { formatDate } from "@/utils/date";
import IntegrationListItem from "./IntegrationListItem";

describe("IntegrationListItem", () => {
    mockRouter.query = { teamId: "1" };
    const integration = {
        ...integrationV1,
        id: 2,
        federation_type: "DATASETS" as const,
        created_at: "2020-01-15T00:00:00.000Z",
        last_run_at: "2020-02-20T09:12:04.000Z",
        enabled: true,
        tested: true,
    };

    it("should render the integration's title, type, created date, last run and status", async () => {
        render(<IntegrationListItem index={1} integration={integration} />);

        expect(screen.getByText("Integration 1")).toBeInTheDocument();
        expect(screen.getByText("Datasets")).toBeInTheDocument();
        expect(screen.getByText("Enabled")).toBeInTheDocument();
        expect(
            screen.getByText(
                formatDate(
                    integration.created_at,
                    "DD MMMM YYYY HH:mm"
                ) as string
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                formatDate(
                    integration.last_run_at as string,
                    "DD MMMM YYYY HH:mm"
                ) as string
            )
        ).toBeInTheDocument();
    });

    it("should show 'Never' as the last run when the integration has not yet run", async () => {
        render(
            <IntegrationListItem
                index={1}
                integration={{ ...integration, last_run_at: null }}
            />
        );

        expect(screen.getByText("Never")).toBeInTheDocument();
    });

    it("should show a Disabled status when the integration is not enabled", async () => {
        render(
            <IntegrationListItem
                index={1}
                integration={{ ...integration, enabled: false }}
            />
        );

        expect(screen.getByText("Disabled")).toBeInTheDocument();
    });

    it("should show a 'Disabled on error' status and the failure reason when the integration has failed", async () => {
        render(
            <IntegrationListItem
                index={1}
                integration={{
                    ...integration,
                    enabled: false,
                    error: true,
                    error_text: "Connection timed out",
                }}
            />
        );

        expect(screen.getByText("Disabled on error")).toBeInTheDocument();
        expect(screen.getByText("Error:")).toBeInTheDocument();
        expect(screen.getByText("Connection timed out")).toBeInTheDocument();
    });

    it("should not show an Error row when the integration has not failed", async () => {
        render(
            <IntegrationListItem
                index={1}
                integration={{ ...integration, error: false, error_text: null }}
            />
        );

        expect(screen.queryByText("Error:")).not.toBeInTheDocument();
    });

    it("should link the Edit action to the integration's detail page", async () => {
        render(<IntegrationListItem index={1} integration={integration} />);

        const editLink = screen.getByRole("link", { name: "Edit" });
        expect(editLink).toHaveAttribute(
            "href",
            "/account/team/1/integrations/integration/list/2"
        );
    });

    it("should link the History action to the detail page's history tab", async () => {
        render(<IntegrationListItem index={1} integration={integration} />);

        const historyLink = screen.getByRole("link", { name: "History" });
        expect(historyLink).toHaveAttribute(
            "href",
            "/account/team/1/integrations/integration/list/2?tab=history"
        );
    });

    it("should disable Run now when the integration is not enabled", async () => {
        render(
            <IntegrationListItem
                index={1}
                integration={{ ...integration, enabled: false }}
            />
        );

        expect(screen.getByRole("button", { name: "Run now" })).toBeDisabled();
    });

    it("should disable Run now when the integration has not been tested", async () => {
        render(
            <IntegrationListItem
                index={1}
                integration={{ ...integration, tested: false }}
            />
        );

        expect(screen.getByRole("button", { name: "Run now" })).toBeDisabled();
    });

    it("should run the Run now action through Run now -> Running -> Complete -> Run now", async () => {
        server.use(getFederationRunV1({ teamId: 1, federationId: 2 }));

        render(<IntegrationListItem index={1} integration={integration} />);

        const runButton = screen.getByRole("button", { name: "Run now" });
        expect(runButton).not.toBeDisabled();

        fireEvent.click(runButton);

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Running" })
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
                ).not.toBeDisabled();
            },
            { timeout: 4000 }
        );
    }, 10000);
});
