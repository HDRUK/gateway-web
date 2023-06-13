import React from "react";
import AuthRouteCheck from "@/components/AuthRouteCheck";
import { render, screen, waitFor } from "../testUtils";

describe("AuthRouteCheck", () => {
    it("should render the protected route if `isProtected` and not authorised", async () => {
        render(
            <AuthRouteCheck isProtected>
                <div>content</div>
            </AuthRouteCheck>,
            { wrapperProps: { user: null } }
        );

        await waitFor(() => {
            expect(screen.getByText("ProtectedRoute.title")).toBeTruthy();
            expect(screen.getByText("ProtectedRoute.text")).toBeTruthy();
        });
    });
    it("should render public content if `isProtected` and authorised", async () => {
        render(
            <AuthRouteCheck isProtected>
                <div>Public component</div>
            </AuthRouteCheck>
        );

        await waitFor(() => {
            expect(screen.getByText("Public component")).toBeTruthy();
        });
    });
    it("should render a public component", async () => {
        render(
            <AuthRouteCheck>
                <div>Public component</div>
            </AuthRouteCheck>
        );

        await waitFor(() => {
            expect(screen.getByText("Public component")).toBeTruthy();
        });
    });
});
