import React from "react";
import HeaderNav from "@/modules/HeaderNav";
import { userV1 } from "@/mocks/data";
import { server } from "@/mocks/server";
import { getAuthInternal } from "@/mocks/handlers/auth";
import { fireEvent, render, screen, waitFor } from "../testUtils";

describe("HeaderNav", () => {
    it("should render logged out component", async () => {
        server.use(getAuthInternal(null));
        render(<HeaderNav />);

        await waitFor(() => {
            expect(
                screen.getByText("HeaderNav.labels.signIn")
            ).toBeInTheDocument();
        });
    });
    it("should render logged in component", async () => {
        render(<HeaderNav />);

        await waitFor(() => {
            expect(screen.getByText(userV1.firstname)).toBeInTheDocument();
        });
    });
    it("renders explore navigation items", async () => {
        render(<HeaderNav />);

        await waitFor(() => {
            expect(screen.getByText("Explore")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("Help")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("Usage data")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("About us")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("News")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("Community")).toBeInTheDocument();
        });
    });

    it("on click of sign-in button, opens up sign-in dialog modal", async () => {
        server.use(getAuthInternal(null));
        render(<HeaderNav />);

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
