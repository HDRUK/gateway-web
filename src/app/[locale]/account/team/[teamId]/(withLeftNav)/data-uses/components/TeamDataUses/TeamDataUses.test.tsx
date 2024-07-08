import mockRouter from "next-router-mock";
import { render, screen, waitFor, within } from "@/utils/testUtils";
import { generateDataUse } from "@/mocks/data/dataUse";
import { getDataUses } from "@/mocks/handlers/dataUses";
import { server } from "@/mocks/server";
import TeamDataUses from "./TeamDataUses";

mockRouter.query = { teamId: "1", tab: "ACTIVE" };
window.scrollTo = jest.fn();

describe("TeamDataUses", () => {
    it("should render all data uses (filtered on BE)", async () => {
        const mockDataUses = [
            generateDataUse({
                status: "ARCHIVED",
            }),
            generateDataUse({
                status: "ACTIVE",
            }),
            generateDataUse({ status: "DRAFT" }),
        ];
        server.use(getDataUses(mockDataUses));
        render(<TeamDataUses permissions={{}} />);

        await waitFor(() => {
            const dataUseCards = screen.getAllByTestId("datause-card");
            expect(dataUseCards).toHaveLength(3);

            expect(
                within(dataUseCards[0]).getByText(
                    `${mockDataUses[0].project_title}`
                )
            ).toBeInTheDocument();
            expect(
                within(dataUseCards[0]).getByText(
                    `${mockDataUses[0].team.name}`
                )
            ).toBeInTheDocument();
            expect(
                within(dataUseCards[0]).getByText(
                    `${mockDataUses[0].datasets[0].shortTitle}`
                )
            ).toBeInTheDocument();
        });
    });
    it("should render message if no active datasets", async () => {
        server.use(getDataUses([]));
        render(<TeamDataUses permissions={{}} />);

        await waitFor(() => {
            expect(
                screen.getByText(
                    "No active data uses found on the Gateway for your team."
                )
            ).toBeInTheDocument();
        });
    });

});
