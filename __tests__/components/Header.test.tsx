import React from "react";
import { Header } from "@/components";
import { server } from "@/mocks/server";
import { getTagsV1 } from "@/mocks/handlers/tags";
import { render, screen, waitFor } from "../testUtils";

describe("Header", () => {
    it("should render logged out component", async () => {
        server.use(getTagsV1(undefined, 401));
        render(<Header />);

        await waitFor(() => {
            expect(screen.getByText("Google")).toBeInTheDocument();
        });
    });
    it("should render logged in component", async () => {
        render(<Header />);

        await waitFor(() => {
            expect(screen.getByText("My Account")).toBeInTheDocument();
        });
    });
});
