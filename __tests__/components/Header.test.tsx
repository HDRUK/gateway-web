import React from "react";
import Header from "@/components/Header";
import { render, screen, waitFor } from "../testUtils";

describe("Header", () => {
    it("should render component", async () => {
        render(<Header />);

        await waitFor(() => {
            expect(screen.getByText("Home")).toBeInTheDocument();
        });
    });
});
