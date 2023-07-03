import React from "react";
import Application from "@/pages/account/application";
import { render, screen, waitFor } from "../../testUtils";

describe("Applications", () => {
    it("should render contents", async () => {
        render(
            <Application />
        );

        await waitFor(() => {
            expect(screen.getByText("Public app name")).toBeInTheDocument();
            expect(screen.queryByText("Placeholder for Auth Tab")).not.toBeInTheDocument();
            expect(screen.queryByText("Placeholder for Scopes/Permissions Tab")).not.toBeInTheDocument();
        });
    });
});