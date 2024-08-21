import React from "react";
import SupportPopOut from "@/components/SupportPopOut";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";

describe("SupportPopOut", () => {
    it("should open support panel ", async () => {
        render(<SupportPopOut />);

        const button = screen.getByRole('button', {
            name: /Need support?/i
          })
        fireEvent.click(button);

        await waitFor(() => {
            expect(
                screen.getByRole('button', {
                    name: /Visit Support Centre?/i
                  })
            ).toBeInTheDocument();
            expect(screen.getByText("Give feedback")).toBeInTheDocument();
            expect(screen.getByText("Report bug")).toBeInTheDocument();
            expect(screen.getByText("Request support")).toBeInTheDocument();
        });
    });
});
