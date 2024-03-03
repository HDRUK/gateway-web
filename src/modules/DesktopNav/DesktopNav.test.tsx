import React from "react";
import DesktopNav from "@/modules/DesktopNav";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";

describe("DesktopNav", () => {
    it("renders navigation items", async () => {
        render(<DesktopNav />);

        await waitFor(() => {
            expect(screen.getByText("Explore")).toBeInTheDocument();
            expect(screen.getByText("About us")).toBeInTheDocument();
            expect(screen.getByText("Releases")).toBeInTheDocument();
        });
    });
    it("On click of nav button, drop down should be visible", async () => {
        render(<DesktopNav />);
        await waitFor(() => {
            fireEvent.click(screen.getByText("Explore"));
            expect(screen.getByText("Datasets")).toBeInTheDocument();
        });
    });
});
