import React from "react";
import { render } from "@testing-library/react";
import Header from "../../src/components/Header/Header";

describe("Header", () => {
    it("renders the header component", () => {
        const { getByRole, getByAltText } = render(<Header />);

        // Assert that the header component is rendered
        const headerComponent = getByRole("banner");
        expect(headerComponent).toBeInTheDocument();

        // Assert that the logo image is rendered
        const logoImage = getByAltText("Gateway home logo");
        expect(logoImage).toBeInTheDocument();

        // Assert that the menu icon button is rendered
        const menuIconButton = getByRole("button", { name: "open drawer" });
        expect(menuIconButton).toBeInTheDocument();

        // // Assert that the header navigation component is rendered
        // const headerNavComponent = getByRole("navigation");
        // expect(headerNavComponent).toBeInTheDocument();
    });
});
