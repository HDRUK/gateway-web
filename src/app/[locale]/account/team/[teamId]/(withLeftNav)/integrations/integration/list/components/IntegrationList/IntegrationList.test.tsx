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

    it("should render count of integrations", async () => {
        await waitFor(() => {
            expect(
                screen.getByTestId("number-of-integrations").textContent
            ).toBe("Number of Integrations: 10");
        });
    });

    it("should render list", async () => {
        await waitFor(() => {
            expect(screen.getByText("Integration 1")).toBeInTheDocument();
            expect(screen.getByText("Integration 10")).toBeInTheDocument();
        });
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
