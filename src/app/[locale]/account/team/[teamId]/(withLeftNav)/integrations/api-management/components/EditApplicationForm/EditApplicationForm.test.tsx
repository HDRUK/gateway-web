import { render, screen } from "@/utils/testUtils";
import { generateApplicationV1 } from "@/mocks/data/application";
import EditApplicationForm from "./EditApplicationForm";

describe("EditApplicationForm", () => {
    const mockApplication = generateApplicationV1();

    it("should render component", async () => {
        render(<EditApplicationForm application={mockApplication} />);
        expect(screen.getByText("Private App name")).toBeInTheDocument();
        expect(screen.getByText("Description")).toBeInTheDocument();
        expect(screen.getByText("Notification Contacts")).toBeInTheDocument();
    });
});
