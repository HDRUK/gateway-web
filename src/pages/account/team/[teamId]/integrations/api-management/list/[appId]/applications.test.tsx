import React from "react";
import EditApplication from "@/pages/account/team/[teamId]/integrations/api-management/list/[appId]";
import { render, screen, waitFor } from "@/utils/testUtils";

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: "",
            asPath: "",
        };
    },
}));

describe("Applications", () => {
    it("should render contents", async () => {
        render(<EditApplication />);
        await waitFor(() => {
            expect(screen.getByText("API Management")).toBeInTheDocument();
            expect(
                screen.queryByText("Placeholder for Auth Tab")
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText("Placeholder for Scopes/Permissions Tab")
            ).not.toBeInTheDocument();
        });
    });
});
