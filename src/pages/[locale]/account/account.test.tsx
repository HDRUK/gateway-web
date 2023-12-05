import React from "react";
import Account from "@/pages/[locale]/account";
import { render, screen, waitFor } from "@/utils/testUtils";

describe("Account", () => {
    it("should render contents", async () => {
        render(<Account />);

        await waitFor(() => {
            expect(screen.getByText("My account")).toBeInTheDocument();
        });
    });
});
