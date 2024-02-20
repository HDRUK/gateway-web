import mockRouter from "next-router-mock";
import { render, screen, waitFor } from "@/utils/testUtils";
import { generateIntegrationsV1 } from "@/mocks/data/integration";
import { getIntegrationsV1 } from "@/mocks/handlers/integration";
import { server } from "@/mocks/server";
import IntegrationList from "./IntegrationList";

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
            expect(
                screen.getByText(
                    `Integration 1 - ${integrationsV1[0].federation_type}`
                )
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    `Integration 10 - ${integrationsV1[9].federation_type}`
                )
            ).toBeInTheDocument();
        });
    });
});
