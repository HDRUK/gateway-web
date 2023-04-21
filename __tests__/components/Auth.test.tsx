import React from "react";
import Auth from "@/components/Auth";
import { getTagsV1 } from "@/mocks/handlers/tags";
import { server } from "@/mocks/server";
import { render, screen, waitFor } from "../testUtils";

describe("Auth", () => {
    it("should render the protected route if `isProtected` and not authorised", async () => {
        server.use(getTagsV1(undefined, 401));

        render(
            <Auth isProtected>
                <div>content</div>
            </Auth>
        );

        await waitFor(() => {
            expect(screen.getByText("Protected route")).toBeTruthy();
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
