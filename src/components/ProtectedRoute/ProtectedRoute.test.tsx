import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/router";
import { useHasPermissions } from "@/hooks/useHasPermission";
import { render, screen } from "@/utils/testUtils";
import protectedRoutes from "@/config/protectedRoutes";

jest.mock("next/router", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@/hooks/useHasPermission", () => ({
    useHasPermissions: jest.fn(),
}));

describe("ProtectedRoute", () => {
    it("should render the content ", async () => {
        let permissions = {};
        permissions[protectedRoutes[0].permissions[0]] = true;
        useHasPermissions.mockImplementation(() => permissions);

        useRouter.mockImplementation(() => ({
            asPath: protectedRoutes[0].route,
            route: protectedRoutes[0].route,
            pathname: "",
            query: {},
        }));

        render(
            <ProtectedRoute>
                <b> This is a protected route </b>
            </ProtectedRoute>
        );

        expect(
            screen.getByText("This is a protected route")
        ).toBeInTheDocument();
    });

    it("should not render the content, but render a 401", async () => {
        let permissions = {};
        permissions[protectedRoutes[0].permissions[0]] = false;
        useHasPermissions.mockImplementation(() => permissions);

        useRouter.mockImplementation(() => ({
            asPath: protectedRoutes[0].route,
            route: protectedRoutes[0].route,
            pathname: "",
            query: {},
        }));

        render(
            <ProtectedRoute>
                <b> This is a protected route </b>
            </ProtectedRoute>
        );

        expect(screen.getByText("401 Unauthorised")).toBeInTheDocument();
    });
});
