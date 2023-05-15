import React from "react";
import Auth from "@/components/Auth";
import { server } from "@/mocks/server";
import { getFiltersV1 } from "@/mocks/handlers/filters";
import { render, screen, waitFor } from "../testUtils";

describe("Auth", () => {
    it("should render the protected route if `isProtected` and not authorised", async () => {
        server.use(getFiltersV1(undefined, 401));

        render(
            <Auth isProtected>
                <div>content</div>
            </Auth>
        );

        await waitFor(() => {
            expect(screen.getByText("ProtectedRoute.title")).toBeTruthy();
            expect(screen.getByText("ProtectedRoute.text")).toBeTruthy();
        });
    });
    it("should render public content if `isProtected` and authorised", async () => {
        render(
            <Auth isProtected>
                <div>Public component</div>
            </Auth>
        );

        await waitFor(() => {
            expect(screen.getByText("Public component")).toBeTruthy();
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
