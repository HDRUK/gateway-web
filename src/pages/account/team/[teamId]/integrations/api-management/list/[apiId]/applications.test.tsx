import React from "react";
import EditApplication from "@/pages/account/team/[teamId]/integrations/api-management/list/[apiId]";
import { render, screen, waitFor } from "@/utils/testUtils";
import { applicationV1 } from "@/mocks/data/application";
import { useHasPermissions } from "@/hooks/useHasPermission";
import mockRouter from "next-router-mock";

jest.mock("next/navigation", () => ({
    useSearchParams() {
        return {
            get: () => "app-info",
        };
    },
}));

jest.mock("@/hooks/useHasPermission", () => ({
    useHasPermissions: jest.fn(),
}));

describe("Applications", () => {
    mockRouter.query = { apiId: applicationV1.id.toString() };
    it("should render contents", async () => {
        const permissions = {
            "fe.account.nav.integrations.api-management": true,
        };
        (useHasPermissions as jest.Mock).mockReturnValue(permissions);

        render(<EditApplication />);
        await waitFor(() => {
            expect(screen.queryByText("API Management")).toBeInTheDocument();
        });
    });
});
