import React from "react";
import TitleWithBg from "@/components/TitleWithBg";
import { render, screen } from "@/utils/testUtils";

describe("TitleWithBg", () => {
    it("should render anchor and content", async () => {
        render(<TitleWithBg title="Title" />);
        expect(screen.getByText("Title")).toBeInTheDocument();
    });
});
