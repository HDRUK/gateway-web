import { screen, render } from "@/utils/testUtils";
import { teamV1 } from "@/mocks/data/team";
import mockRouter from "next-router-mock";
import EditIntegrationForm from "./EditIntegrationForm";

describe("EditIntegrationForm", () => {
    mockRouter.query = { teamId: teamV1.id.toString(), intId: "2" };
    it("should disable federation dropdown", () => {
        render(<EditIntegrationForm />);
        const allButtons = screen.getAllByRole("button");
        expect(allButtons[1]).toHaveClass("Mui-disabled");
    });
});
