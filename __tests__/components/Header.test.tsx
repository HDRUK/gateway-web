import React from "react";
import Header from "@/components/Header";
import { render, screen } from "../testUtils";

describe("Header", () => {
    it("renders the header component", () => {
        render(<Header />);

        const headerComponent = screen.getByRole("banner");
        expect(headerComponent).toBeInTheDocument();
    });
    it("menu icon button is rendered", () => {
        render(<Header />);

        const menuIconButton = screen.getByRole("button", {
            name: "open drawer",
        });
        expect(menuIconButton).toBeInTheDocument();
    });
    it("logo image is rendered", () => {
        render(<Header />);

        const logoImage = screen.getByAltText("Gateway home logo");
        expect(logoImage).toBeInTheDocument();
    });
});
