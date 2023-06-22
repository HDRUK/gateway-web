import React from "react";
import SignInDialog from "@/modules/dialogs/SignInDialog";
import vars from "@/config/vars";
import { render, screen, waitFor } from "../../testUtils";

describe("SignInDialog", () => {
    it("should render component title", async () => {
        render(<SignInDialog />);

        await waitFor(() => {
            expect(
                screen.getByText("dialogs.SignInDialog.title")
            ).toBeInTheDocument();
        });
    });
    it("should render azure link", async () => {
        render(<SignInDialog />);
        const azureButton = screen.getByText(
            "dialogs.SignInDialog.socialProviders.azure"
        );
        expect(azureButton).toBeInTheDocument();
        expect(azureButton).toHaveAttribute("href", vars.authAzureV1Url);
    });
    it("should render google link", async () => {
        render(<SignInDialog />);
        const googleButton = screen.getByText(
            "dialogs.SignInDialog.socialProviders.google"
        );
        expect(googleButton).toBeInTheDocument();
        expect(googleButton).toHaveAttribute("href", vars.authGoogleV1Url);
    });
    it("should render linkedIn link", async () => {
        render(<SignInDialog />);
        const linkedInButton = screen.getByText(
            "dialogs.SignInDialog.socialProviders.linkedIn"
        );
        expect(linkedInButton).toBeInTheDocument();
        expect(linkedInButton).toHaveAttribute("href", vars.authLinkedinV1Url);
    });
});
