import React from "react";
import TitlePanel from "@/components/TitlePanel";
import { render, screen } from "@/utils/testUtils";

describe("TitlePanel", () => {
    it("should render anchor and content", async () => {
        render(
            <TitlePanel
                title="This is a title"
                text="This is a sub text"
                image="/images/homepage/welcome-image.webp"
            />
        );
        expect(screen.getByText("This is a title")).toBeInTheDocument();
        expect(screen.getByText("This is a sub text")).toBeInTheDocument();
    });
});
