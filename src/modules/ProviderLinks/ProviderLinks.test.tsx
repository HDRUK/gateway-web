import React from "react";
import ProviderLinks from "@/modules/ProviderLinks";
import { render, screen } from "@/utils/testUtils";

describe("ProviderLinks", () => {
    it("should match snapshot", async () => {
        const wrapper = render(<ProviderLinks />);

        expect(wrapper.container).toMatchSnapshot();
    });

    it("should render component", async () => {
        render(<ProviderLinks />);

        expect(
            screen.getByAltText("dialogs.ProvidersDialog.socialProviders.azure")
        ).toBeInTheDocument();
        expect(
            screen.getByAltText(
                "dialogs.ProvidersDialog.socialProviders.linkedIn"
            )
        ).toBeInTheDocument();
        expect(
            screen.getByAltText(
                "dialogs.ProvidersDialog.socialProviders.google"
            )
        ).toBeInTheDocument();
    });
});
