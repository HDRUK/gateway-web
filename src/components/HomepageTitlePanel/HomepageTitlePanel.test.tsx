import React from "react";
import HomepageTitlePanel from "@/components/HomepageTitlePanel";
import { render, screen } from "@/utils/testUtils";

describe("HomepageTitlePanel", () => {
    it("should render anchor and content", async () => {
        render(
            <HomepageTitlePanel
                title="This is a title"
                text="This is a sub text"
                image="/images/homepage/welcome-image.png"
            />
        );
        expect(screen.getByText("Tile")).toBeInTheDocument();
    });
});
