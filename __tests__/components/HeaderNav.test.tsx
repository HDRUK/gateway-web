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
                screen.getByText("HeaderNav.labels.google")
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
});
