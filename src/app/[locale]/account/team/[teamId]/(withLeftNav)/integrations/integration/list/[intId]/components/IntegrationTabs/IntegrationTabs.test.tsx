import mockRouter from "next-router-mock";
import { render, screen } from "@/utils/testUtils";
import IntegrationTabs from "./IntegrationTabs";

jest.mock("../EditIntegrationForm", () => ({
    __esModule: true,
    default: () => <div>Configuration content</div>,
}));

jest.mock("../IntegrationHistoryTable", () => ({
    __esModule: true,
    default: () => <div>History content</div>,
}));

describe("IntegrationTabs", () => {
    it("shows the Configuration tab content by default", () => {
        mockRouter.query = { teamId: "1", intId: "2" };

        render(<IntegrationTabs />);

        expect(screen.getByText("Configuration content")).toBeInTheDocument();
        expect(screen.queryByText("History content")).not.toBeInTheDocument();
    });

    it("shows the History tab content when ?tab=history is set", () => {
        mockRouter.query = { teamId: "1", intId: "2", tab: "history" };

        render(<IntegrationTabs />);

        expect(screen.getByText("History content")).toBeInTheDocument();
        expect(
            screen.queryByText("Configuration content")
        ).not.toBeInTheDocument();
    });
});
