import React from "react";
import CharacterLimit from "@/components/CharacterLimit";
import { render, screen } from "@/utils/testUtils";

describe("CharacterLimit", () => {
    it("should render remaining count", async () => {
        render(<CharacterLimit count={24} limit={100} />);

        expect(screen.getByText("(76/100)")).toBeInTheDocument();
    });
});
