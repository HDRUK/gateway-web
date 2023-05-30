import React from "react";
import HeaderNav from "@/components/HeaderNav";
import { server } from "@/mocks/server";
import { getFiltersV1 } from "@/mocks/handlers/filters";
import { render, screen, waitFor } from "../testUtils";

describe("HeaderNav", () => {
    it("should render logged out component", async () => {
        server.use(getFiltersV1(undefined, 401));
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
            expect(
                screen.getByText("HeaderNav.labels.myAccount")
            ).toBeInTheDocument();
        });
    });
    it("renders explore navigation items", () => {
        render(<HeaderNav />);

        const exploreItem = screen.getByText("Explore");
        expect(exploreItem).toBeInTheDocument();

        const helpItem = screen.getByText("Help");
        expect(helpItem).toBeInTheDocument();

        const usageDataItem = screen.getByText("Usage data");
        expect(usageDataItem).toBeInTheDocument();

        const aboutUsItem = screen.getByText("About us");
        expect(aboutUsItem).toBeInTheDocument();
        const newsLink = screen.getByText("News");
        expect(newsLink).toBeInTheDocument();

        const communityLink = screen.getByText("Community");
        expect(communityLink).toBeInTheDocument();
    });
    it("renders sign-in button when user is not logged in", () => {
        render(<HeaderNav />);

        const signInButton = screen.getByText("Sign In");
        expect(signInButton).toBeInTheDocument();
    });
});
