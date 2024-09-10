import React from "react";
import DesktopNav from "@/modules/DesktopNav";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";

describe("DesktopNav", () => {
    it("renders navigation items", async () => {
        render(<DesktopNav />);

        await waitFor(() => {
            expect(screen.getByText("Search")).toBeInTheDocument();
            expect(screen.getByText("Community")).toBeInTheDocument();
            expect(screen.getByText("News")).toBeInTheDocument();
            expect(screen.getByText("About")).toBeInTheDocument();
            expect(screen.getByText("Help")).toBeInTheDocument();
        });
    });
    it("On click of nav button, drop down should be visible", async () => {
        render(<DesktopNav />);
        await waitFor(() => {
            fireEvent.click(screen.getByText("Search"));
            expect(screen.getByText("Datasets & BioSamples")).toBeInTheDocument();
        });
    });
});
