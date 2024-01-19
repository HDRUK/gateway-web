import React from "react";
import ShowMoreTooltip from "@/components/ShowMoreTooltip";
import { render, screen } from "@/utils/testUtils";

describe("ShowMoreTooltip", () => {
    it("should render component without tooltip", async () => {
        render(<ShowMoreTooltip items={["one", "two", "three"]} />);

        expect(screen.getByText("one, two, three")).toBeInTheDocument();
        expect(screen.queryByText("...more")).not.toBeInTheDocument();
    });
    it("should render component with tooltip", async () => {
        render(<ShowMoreTooltip items={["one", "two", "three", "four"]} />);

        expect(screen.getByText("one, two, three")).toBeInTheDocument();
        expect(screen.getByText("...more")).toBeInTheDocument();
    });

    it("should increase show limit", async () => {
        render(
            <ShowMoreTooltip
                showLimit={4}
                items={["one", "two", "three, four"]}
            />
        );

        expect(screen.getByText("one, two, three, four")).toBeInTheDocument();
        expect(screen.queryByText("...more")).not.toBeInTheDocument();
    });
});
