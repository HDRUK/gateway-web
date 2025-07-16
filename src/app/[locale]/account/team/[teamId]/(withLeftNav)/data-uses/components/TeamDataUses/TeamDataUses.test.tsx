import mockRouter from "next-router-mock";
import { render, screen, waitFor, within } from "@/utils/testUtils";
import { generateDataUse } from "@/mocks/data/dataUse";
import { getTeamDataUsesV2 } from "@/mocks/handlers/teams/v2";
import { server } from "@/mocks/server";
import TeamDataUses from "./TeamDataUses";

mockRouter.query = { teamId: "5", tab: "ACTIVE" };
window.scrollTo = jest.fn();

describe("TeamDataUses", () => {
    it("should render all data uses", async () => {
        const mockDataUses = [
            generateDataUse({
                team: {
                    name: "TEAM 1",
                },
            }),
        ];

        server.use(getTeamDataUsesV2(mockDataUses));
        render(<TeamDataUses permissions={{}} teamId="1" />);

        await waitFor(() => {
            const dataUseCards = screen.getAllByTestId("datause-card");
            expect(dataUseCards).toHaveLength(1);

            expect(
                within(dataUseCards[0]).getByText("TEAM 1")
            ).toBeInTheDocument();
        });
    });

    it("should render message if no active data uses", async () => {
        server.use(getTeamDataUsesV2(undefined, undefined, 1, 0));

        render(<TeamDataUses permissions={{}} teamId="1" />);

        await waitFor(() => {
            expect(
                screen.getByText(
                    "No active data uses found on the Gateway for your team."
                )
            ).toBeInTheDocument();
        });
    });
});
