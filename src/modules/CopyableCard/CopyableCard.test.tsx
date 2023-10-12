import { fireEvent, render, screen } from "@/utils/testUtils";
import { generateApplicationV1 } from "@/mocks/data/application";
import CopyableCard from "./CopyableCard";
import * as notificationService from "@/services/notification/notification";

jest.mock("notistack", () => {
    return {
        ...jest.requireActual("notistack"),
        enqueueSnackbar: jest.fn(),
        __esModule: true,
    };
});

jest.mock("@/services/notification/notification", () => {
    return {
        ...jest.requireActual("@/services/notification/notification"),
        apiError: jest.fn(),
        error: jest.fn(),
        apiSuccess: jest.fn(),
        success: jest.fn(),
        warning: jest.fn(),
        info: jest.fn(),
        __esModule: true,
    };
});

describe("CopyableCard", () => {
    beforeAll(() => {
        Object.defineProperty(navigator, "clipboard", {
            writable: true,
            value: {
                writeText: jest.fn(),
            },
        });
    });

    const mockApplication = generateApplicationV1();

    it("triggers clipboard copy when the Copy button is clicked", () => {
        render(<CopyableCard value={mockApplication.app_id} description={"test text"} label={"test"}/>);

        expect(screen.getByText("test text")).toBeInTheDocument();
        expect(screen.getByText(mockApplication.app_id)).toBeInTheDocument();

        const copyButton = screen.getAllByRole("button",{
            name: "copy text",
        })[0];

        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
            mockApplication.app_id
        );
    
        expect(notificationService.success).toBeCalledWith(
            "Link copied"
        );

    });
});
