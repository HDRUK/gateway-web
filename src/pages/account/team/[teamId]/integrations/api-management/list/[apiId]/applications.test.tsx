import React from "react";
import EditApplication from "@/pages/account/team/[teamId]/integrations/api-management/list/[apiId]";
import { render, screen, waitFor } from "@/utils/testUtils";
import { applicationV1 } from "@/mocks/data/application";

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: { apiId: applicationV1.id },
            asPath: "",
        };
    },
}));

jest.mock("next/navigation", () => ({
    useSearchParams() {
        return {
            get: () => "app-info",
        };
    },
}));

describe("Applications", () => {
    it("should render contents", async () => {
        render(<EditApplication />);
        await waitFor(() => {
            expect(screen.queryByText("API Management")).toBeInTheDocument();
        });
    });
});
