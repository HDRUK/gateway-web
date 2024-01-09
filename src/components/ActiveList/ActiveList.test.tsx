import React from "react";
import BulletList from "@/components/BulletList";
import { render, screen } from "@/utils/testUtils";

describe("BulletList", () => {
    it("should render component", async () => {
        render(
            <BulletList
                items={[{ label: "Item one" }, { label: "Item two" }]}
            />
        );

        expect(screen.getByText("Item one")).toBeInTheDocument();
        expect(screen.getByText("Item two")).toBeInTheDocument();
        expect(screen.getAllByTestId("CheckCircleIcon")).toHaveLength(2);
    });
});
