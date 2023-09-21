import React from "react";
import Header from "@/components/Header";
import { userV1 } from "@/mocks/data";
import { server } from "@/mocks/server";
import { getAuthInternal } from "@/mocks/handlers/auth";
import { render, screen, fireEvent, waitFor } from "@/utils/testUtils";

describe("Header", () => {
    it("renders the header component", () => {
        render(<Header />);

        const headerComponent = screen.getByRole("banner");
        expect(headerComponent).toBeInTheDocument();
    });
    it("should render logged out component", async () => {
        server.use(getAuthInternal(null));
        render(<Header />);

        await waitFor(() => {
            expect(
                screen.getByText("HeaderNav.labels.signIn")
            ).toBeInTheDocument();
        });
    });
    it("should render logged in component", async () => {
        render(<Header />);

        await waitFor(() => {
            expect(screen.getByText(userV1.firstname)).toBeInTheDocument();
        });
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
    it("on click of sign-in button, opens up sign-in dialog modal", async () => {
        server.use(getAuthInternal(null));
        render(<Header />);

        await waitFor(() => {
            fireEvent.click(screen.getByText("HeaderNav.labels.signIn"));
            expect(
                screen.getByText(
                    "dialogs.ProvidersDialog.socialProviders.google"
                )
            ).toBeInTheDocument();
        });
    });
});
