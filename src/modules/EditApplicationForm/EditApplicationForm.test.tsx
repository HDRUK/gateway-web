import { render, screen, within } from "@/utils/testUtils";
import EditApplicationForm from "./EditApplicationForm";
import { generateApplicationV1 } from "@/mocks/data/application";

describe("EditApplicationForm", () => {
    const mockApplication = generateApplicationV1();

    it("should render component", async () => {
        render(<EditApplicationForm application={mockApplication} />);
        expect(screen.getByText("Public API name")).toBeInTheDocument();
        expect(screen.getByText("Description")).toBeInTheDocument();
        expect(screen.getByText("Notification Contacts")).toBeInTheDocument();
    });
});
