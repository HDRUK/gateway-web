import React from "react";
import SupportPopOut from "@/components/SupportPopOut";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";

describe("SupportPopOut", () => {
    it("should open support panel ", async () => {
        render(<SupportPopOut />);

        const button = screen.getByText("Need support?");
        fireEvent.click(button);

        await waitFor(() => {
            expect(
                screen.getByText("Visit Support Centre")
            ).toBeInTheDocument();
            expect(screen.getByText("Give feedback")).toBeInTheDocument();
            expect(screen.getByText("Report bug")).toBeInTheDocument();
            expect(screen.getByText("Request support")).toBeInTheDocument();
        });
    });
});
