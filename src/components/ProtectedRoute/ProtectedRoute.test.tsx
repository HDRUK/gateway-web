import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useHasPermissions } from "@/hooks/useHasPermission";
import { render, screen } from "@/utils/testUtils";

jest.mock("@/hooks/useHasPermission", () => ({
    useHasPermissions: jest.fn(),
}));

describe("ProtectedRoute", () => {
    it("should render the content ", async () => {
        const permissions = { "fe.account.nav.datasets": true };

        (useHasPermissions as jest.Mock).mockReturnValue(permissions);

        render(
            <ProtectedRoute permissions={["fe.account.nav.datasets"]}>
                <b> This is a protected route </b>
            </ProtectedRoute>
        );

        expect(
            screen.getByText("This is a protected route")
        ).toBeInTheDocument();
    });

    it("should not render the content, but render a 401", async () => {
        const permissions = { "fe.account.nav.datasets": false };
        (useHasPermissions as jest.Mock).mockReturnValue(permissions);

        render(
            <ProtectedRoute permissions={["fe.account.nav.datasets"]}>
                <b> This is a protected route </b>
            </ProtectedRoute>
        );

        expect(screen.getByText("401 Unauthorised")).toBeInTheDocument();
    });
});
