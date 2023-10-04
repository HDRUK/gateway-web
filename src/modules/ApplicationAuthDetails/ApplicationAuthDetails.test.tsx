import { fireEvent, render, screen } from "@/utils/testUtils";
import { generateApplicationV1 } from "@/mocks/data/application";
import ApplicationAuthDetails from "./ApplicationAuthDetails";

describe("ApplicationAuthDetails", () => {
    beforeAll(() => {
        Object.defineProperty(navigator, "clipboard", {
            writable: true,
            value: {
                writeText: jest.fn(),
            },
        });
    });

    const mockApplication = generateApplicationV1();

    it("renders the App ID and Client Id", () => {
        render(<ApplicationAuthDetails application={mockApplication} />);

        expect(screen.getByText("App ID")).toBeInTheDocument();
        expect(screen.getByText("Client ID")).toBeInTheDocument();

        expect(screen.getByText(mockApplication.app_id)).toBeInTheDocument();
        expect(screen.getByText(mockApplication.client_id)).toBeInTheDocument();
    });

    it("triggers clipboard copy when the Copy button is clicked", () => {
        render(<ApplicationAuthDetails application={mockApplication} />);

        const copyButton = screen.getAllByText("Copy")[0];

        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
            mockApplication.app_id
        );
    });
});
