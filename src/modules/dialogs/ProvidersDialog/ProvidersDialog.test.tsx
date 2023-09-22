import React from "react";
import ProvidersDialog from "@/modules/dialogs/ProvidersDialog";
import apis from "@/config/apis";
import { render, screen, waitFor } from "@/utils/testUtils";

describe("ProvidersDialog", () => {
    it("should render component title", async () => {
        render(<ProvidersDialog />);

        await waitFor(() => {
            expect(
                screen.getByText("dialogs.ProvidersDialog.title")
            ).toBeInTheDocument();
        });
    });
    it("should render azure link", async () => {
        render(<ProvidersDialog />);
        const azureButton = screen.getByText(
            "dialogs.ProvidersDialog.socialProviders.azure"
        );
        expect(azureButton).toBeInTheDocument();
        expect(azureButton).toHaveAttribute("href", apis.authAzureV1Url);
    });
    it("should render google link", async () => {
        render(<ProvidersDialog />);
        const googleButton = screen.getByText(
            "dialogs.ProvidersDialog.socialProviders.google"
        );
        expect(googleButton).toBeInTheDocument();
        expect(googleButton).toHaveAttribute("href", apis.authGoogleV1Url);
    });
    it("should render linkedIn link", async () => {
        render(<ProvidersDialog />);
        const linkedInButton = screen.getByText(
            "dialogs.ProvidersDialog.socialProviders.linkedIn"
        );
        expect(linkedInButton).toBeInTheDocument();
        expect(linkedInButton).toHaveAttribute("href", apis.authLinkedinV1Url);
    });
});
