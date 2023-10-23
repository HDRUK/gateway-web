import { screen, render } from "@/utils/testUtils";
import { teamV1 } from "@/mocks/data/team";
import EditIntegrationForm from "./EditIntegrationForm";

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: { teamId: teamV1.id, intId: 2 },
            asPath: "",
            events: { on: jest.fn(), off: jest.fn() },
        };
    },
}));

describe("EditIntegrationForm", () => {
    it("should disable federation dropdown", () => {
        render(<EditIntegrationForm />);
        const allButtons = screen.getAllByRole("button");
        expect(allButtons[1]).toHaveClass("Mui-disabled");
    });
});
