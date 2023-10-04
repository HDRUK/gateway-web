import React from "react";
import ProvidersDialog from "@/modules/ProvidersDialog";
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
            "dialogs.ProvidersDialog.socialProviders.azure",
            { exact: false }
        );
        expect(azureButton).toBeInTheDocument();

        expect(azureButton.closest("a")).toHaveAttribute(
            "href",
            apis.authAzureV1Url
        );
    });
    it("should render google link", async () => {
        render(<ProvidersDialog />);
        const googleButton = screen.getByText(
            "dialogs.ProvidersDialog.socialProviders.google",
            { exact: false }
        );
        expect(googleButton).toBeInTheDocument();
        expect(googleButton.closest("a")).toHaveAttribute(
            "href",
            apis.authGoogleV1Url
        );
    });
    it("should render linkedIn link", async () => {
        render(<ProvidersDialog />);
        const linkedInButton = screen.getByText(
            "dialogs.ProvidersDialog.socialProviders.linkedIn",
            { exact: false }
        );
        expect(linkedInButton).toBeInTheDocument();
        expect(linkedInButton.closest("a")).toHaveAttribute(
            "href",
            apis.authLinkedinV1Url
        );
    });
});
