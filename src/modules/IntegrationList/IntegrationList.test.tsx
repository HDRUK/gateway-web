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
    console.log(integrationsV1);

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

    /*
    it("should render list", async () => {
        await waitFor(() => {
            expect(screen.getByText(data[0].name)).toBeInTheDocument();
            expect(screen.getByText(data[1].name)).toBeInTheDocument();
            expect(screen.getByText(data[2].name)).toBeInTheDocument();
            expect(
                screen.getByText(`APP ID: ${data[0].app_id}`)
            ).toBeInTheDocument();
            expect(
                screen.getByText(`APP ID: ${data[1].app_id}`)
            ).toBeInTheDocument();
            expect(
                screen.getByText(`APP ID: ${data[2].app_id}`)
            ).toBeInTheDocument();
        });
    });
    it("should render pagination", async () => {
        await waitFor(() => {
            const paginationItems = screen.getAllByTestId("pagination-item");
            expect(paginationItems[1].textContent).toBe("1");
            expect(paginationItems[2].textContent).toBe("2");
            expect(paginationItems).toHaveLength(4);

            expect(screen.getByTestId("ArrowLeftIcon")).toBeInTheDocument();
            expect(screen.getByTestId("ArrowRightIcon")).toBeInTheDocument();
        });
    });
    */
});
