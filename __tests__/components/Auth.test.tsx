import React from "react";
import { Auth } from "@/components";
import { render, screen, waitFor } from "../testUtils";

describe("Auth", () => {
    it("should render the protected route", async () => {
        render(
            <Auth>
                <div>content</div>
            </Auth>
        );

        await waitFor(() => {
            expect(screen.getByText("Protected route")).toBeTruthy();
        });
    });
    it("should render a public component", async () => {
        render(
            <Auth>
                <div>Public component</div>
            </Auth>
        );

        await waitFor(() => {
            expect(screen.getByText("Public component")).toBeTruthy();
        });
    });
});
