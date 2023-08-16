import React from "react";
import TeamMembers from "@/modules/TeamManagement/TeamMembers";
import { render, screen, waitFor } from "../../testUtils";

describe("TeamManagement", () => {
    it("should render contents", async () => {
        render(<TeamMembers />);

        await waitFor(() => {
            expect(screen.getByText("Team")).toBeInTheDocument();
            expect(
                screen.getByText("Data Access Requests")
            ).toBeInTheDocument();
            expect(screen.getByText("Metadata")).toBeInTheDocument();
            expect(screen.getByText("Further Actions")).toBeInTheDocument();
        });
    });
});
