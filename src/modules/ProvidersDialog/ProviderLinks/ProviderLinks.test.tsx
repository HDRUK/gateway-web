import React from "react";
import ProviderLinks from "@/modules/ProvidersDialog/ProviderLinks";
import { render, screen } from "@/utils/testUtils";

describe("ProviderLinks", () => {
    it("should match snapshot", async () => {
        const wrapper = render(<ProviderLinks />);

        expect(wrapper.container).toMatchSnapshot();
    });

    it("should render component", async () => {
        render(<ProviderLinks />);

        expect(screen.getByAltText("Azure")).toBeInTheDocument();
        expect(screen.getByAltText("LinkedIn")).toBeInTheDocument();
        expect(screen.getByAltText("Google")).toBeInTheDocument();
    });
});
