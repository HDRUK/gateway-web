import { render, screen, waitFor } from "@/utils/testUtils";
import { server } from "@/mocks/server";
import { generateIntegrationsV1 } from "@/mocks/data/integration";
import { getIntegrationsV1 } from "@/mocks/handlers/integration";
import IntegrationList from "./IntegrationList";

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: { teamId: 1 },
            asPath: "",
        };
    },
}));

describe("IntegrationList", () => {
    //generation 10 integrations
    const integrationsV1 = generateIntegrationsV1(10);

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
            expect(screen.getByTestId("number-of-integrations").textContent).toBe(
                "Number of Integrations: 10"
            );
        });
    });

    it("should render list", async () => {
        await waitFor(() => {
            expect(screen.getByText(`Integration 1 - ${integrationsV1[0].federation_type}`)).toBeInTheDocument();
            expect(screen.getByText(`Integration 10 - ${integrationsV1[9].federation_type}`)).toBeInTheDocument();

        });
    });

});
