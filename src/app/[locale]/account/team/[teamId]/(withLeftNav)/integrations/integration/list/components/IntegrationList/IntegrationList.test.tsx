import mockRouter from "next-router-mock";
import { render, screen, waitFor, fireEvent } from "@/utils/testUtils";
import { generateIntegrationsV1 } from "@/mocks/data/integration";
import {
    getFederationRunV1,
    getIntegrationsV1,
} from "@/mocks/handlers/integration";
import { server } from "@/mocks/server";
import IntegrationList from "./IntegrationList";

jest.mock("notistack", () => ({
    ...jest.requireActual("notistack"),
    enqueueSnackbar: jest.fn(),
    __esModule: true,
}));

describe("IntegrationList", () => {
    mockRouter.query = { teamId: "1" };
    const integrationsV1 = generateIntegrationsV1(10);
    window.scrollTo = jest.fn();

    beforeEach(() => {
        server.use(
            getIntegrationsV1({
                data: integrationsV1,
            })
        );
        render(<IntegrationList />);
    });

    it("should render list", async () => {
        await waitFor(() => {
            expect(screen.getByText("Integration 1")).toBeInTheDocument();
            expect(screen.getByText("Integration 10")).toBeInTheDocument();
        });
    });
});

describe("IntegrationList - empty state", () => {
    mockRouter.query = { teamId: "1" };
    window.scrollTo = jest.fn();

    it("should invite the user to create one when there are none", async () => {
        server.use(getIntegrationsV1({ data: [] }));

        render(<IntegrationList />);

        expect(
            await screen.findByText(
                "You have not created any predefined integrations yet."
            )
        ).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Create one" })).toHaveAttribute(
            "href",
            "/account/team/1/integrations/integration/create"
        );
    });

    it("should not show the empty message when integrations exist", async () => {
        server.use(getIntegrationsV1({ data: generateIntegrationsV1(1) }));

        render(<IntegrationList />);

        expect(await screen.findByText("Integration 1")).toBeInTheDocument();
        expect(
            screen.queryByText(
                "You have not created any predefined integrations yet."
            )
        ).not.toBeInTheDocument();
    });
});

describe("IntegrationList - refreshing after Run now", () => {
    mockRouter.query = { teamId: "1" };
    window.scrollTo = jest.fn();

    it("should clear an item's error banner after a successful Run now", async () => {
        const failingIntegration = {
            ...generateIntegrationsV1(1)[0],
            id: 2,
            enabled: true,
            tested: true,
            error: true,
            error_text: "Connection timed out",
        };
        const fixedIntegration = {
            ...failingIntegration,
            error: false,
            error_text: null,
        };

        server.use(
            getIntegrationsV1({ data: [failingIntegration] }),
            getFederationRunV1({ teamId: 1, federationId: 2 })
        );

        render(<IntegrationList />);

        expect(
            await screen.findByText("Connection timed out")
        ).toBeInTheDocument();

        server.use(getIntegrationsV1({ data: [fixedIntegration] }));

        fireEvent.click(screen.getByRole("button", { name: "Run now" }));

        await waitFor(() => {
            expect(
                screen.queryByText("Connection timed out")
            ).not.toBeInTheDocument();
        });
    });
});
