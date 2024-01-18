import React from "react";
import TickCrossIcon from "@/components/TickCrossIcon";
import { render, screen } from "@/utils/testUtils";

describe("TickCrossIcon", () => {
    it("should render CheckCircleIcon icon", async () => {
        render(<TickCrossIcon isTrue />);

        expect(screen.getByTestId("CheckCircleIcon")).toBeInTheDocument();
    });
    it("should render CancelIcon icon", async () => {
        render(<TickCrossIcon isTrue={false} />);

        expect(screen.getByTestId("CancelIcon")).toBeInTheDocument();
    });
});
