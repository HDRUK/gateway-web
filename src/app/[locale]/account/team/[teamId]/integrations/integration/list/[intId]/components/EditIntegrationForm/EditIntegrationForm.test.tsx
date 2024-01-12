import mockRouter from "next-router-mock";
import { screen, render } from "@/utils/testUtils";
import { teamV1 } from "@/mocks/data/team";
import EditIntegrationForm from "./EditIntegrationForm";

describe("EditIntegrationForm", () => {
    mockRouter.query = { teamId: teamV1.id.toString(), intId: "2" };
    it("should disable federation dropdown", () => {
        render(<EditIntegrationForm />);
        const allSelects = screen.getAllByRole("combobox");
        expect(allSelects[0]).toHaveClass("Mui-disabled");
    });
});
