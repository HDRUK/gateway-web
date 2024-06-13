import React from "react";
import ProvidersDialog from "@/modules/ProvidersDialog";
import apis from "@/config/apis";
import { render, screen, waitFor } from "@/utils/testUtils";

describe("ProvidersDialog", () => {
    it("should render component title", async () => {
        render(<ProvidersDialog />);

        await waitFor(() => {
            expect(
                screen.getByText("Sign in or create an account")
            ).toBeInTheDocument();
        });
    });
    it("should render azure link", async () => {
        render(<ProvidersDialog />);
        const azureButton = screen.getByText("Sign in with Azure", {
            exact: false,
        });
        expect(azureButton).toBeInTheDocument();

        expect(azureButton.closest("a")).toHaveAttribute(
            "href",
            apis.authAzureV1Url
        );
    });
    it("should render google link", async () => {
        render(<ProvidersDialog />);
        const googleButton = screen.getByText("Sign in with Google", {
            exact: false,
        });
        expect(googleButton).toBeInTheDocument();
        expect(googleButton.closest("a")).toHaveAttribute(
            "href",
            apis.authGoogleV1Url
        );
    });
    it("should render linkedIn link", async () => {
        render(<ProvidersDialog />);
        const linkedInButton = screen.getByText("Sign in with LinkedIn", {
            exact: false,
        });
        expect(linkedInButton).toBeInTheDocument();
        expect(linkedInButton.closest("a")).toHaveAttribute(
            "href",
            apis.authLinkedinV1Url
        );
    });
});
