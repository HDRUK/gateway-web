import React from "react";
import Header from "@/components/Header";
import { render } from "../testUtils";

describe("Header", () => {
    it("renders the header component", () => {
        const { getByRole } = render(<Header />);

        const headerComponent = getByRole("banner");
        expect(headerComponent).toBeInTheDocument();
    });
    it("menu icon button is rendered", () => {
        const { getByRole } = render(<Header />);

        const menuIconButton = getByRole("button", { name: "open drawer" });
        expect(menuIconButton).toBeInTheDocument();
    });
    it("logo image is rendered", () => {
        const { getByAltText } = render(<Header />);

        const logoImage = getByAltText("Gateway home logo");
        expect(logoImage).toBeInTheDocument();
    });
});
