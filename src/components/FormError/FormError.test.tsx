import React from "react";
import { render, screen } from "@/utils/testUtils";
import FormError from "./FormError";

describe("FormError", () => {
    const error = [
        { message: "Min not met", type: "max" },
        { message: "Max exceeded", type: "max" },
        { message: "Max exceeded", type: "max" },
    ];

    it("renders without duplicate errors", () => {
        render(<FormError error={error} />);
        expect(screen.getAllByText("Min not met")).toHaveLength(1);
        expect(screen.getAllByText("Max exceeded")).toHaveLength(1);
    });
});
