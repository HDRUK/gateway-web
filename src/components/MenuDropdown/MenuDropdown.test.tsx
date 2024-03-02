import React from "react";
import DesktopNav from "@/modules/DesktopNav";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";

describe("DesktopNav", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = (props: any) => {
        return <DesktopNav {...props} />;
    };
    it("renders explore navigation items", async () => {
        render(<Component />);

        await waitFor(() => {
            expect(screen.getByText("Explore")).toBeInTheDocument();
            expect(screen.getByText("Help")).toBeInTheDocument();
            expect(screen.getByText("Usage data")).toBeInTheDocument();
            expect(screen.getByText("About us")).toBeInTheDocument();
            expect(screen.getByText("News")).toBeInTheDocument();
            expect(screen.getByText("Community")).toBeInTheDocument();
        });
    });
    it("On click of nav button, drop down should be visible", async () => {
        render(<Component />);
        await waitFor(() => {
            fireEvent.click(screen.getByText("Explore"));
            expect(screen.getByText("Datasets")).toBeInTheDocument();
            expect(screen.getByText("Tools")).toBeInTheDocument();
            expect(screen.getByText("Projects")).toBeInTheDocument();
            expect(screen.getByText("Papers")).toBeInTheDocument();
            expect(screen.getByText("Courses")).toBeInTheDocument();
            expect(screen.getByText("People")).toBeInTheDocument();
            expect(screen.getByText("Cohort Discovery")).toBeInTheDocument();
            expect(screen.getByText("Data Utility Wizard")).toBeInTheDocument();
        });
    });
});
