import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/utils/testUtils";
import InfoHoverPanel from "./InfoHoverPanel";

describe("InfoHoverPanel", () => {
    const items = [
        {
            id: "datasets",
            image: "/images/homepage/welcome-image.png",
            href: "/search?type=datasets",
        },
        {
            id: "dur",
            image: "/images/homepage/welcome-image.png",
            href: "/search?type=dur",
        },
    ];

    it("should render default", async () => {
        render(<InfoHoverPanel items={items} />);
        expect(screen.getByText("Datasets / BioSamples")).toBeInTheDocument();
        expect(
            screen.getByText("Data Uses / Research projects")
        ).toBeInTheDocument();
        expect(screen.getByText("Welcome to The Gateway")).toBeInTheDocument();
        expect(
            screen.getByText(
                "A knowledge graph to explore and access the wealth of health data and research from across the UK and beyond"
            )
        ).toBeInTheDocument();
    });
    it("should change on hover default", async () => {
        render(<InfoHoverPanel items={items} />);

        const dur = screen.getByText("Data Uses / Research projects");
        userEvent.hover(dur);

        await waitFor(() => {
            expect(
                screen.getByText(
                    "Find data uses/research projects: Search and filter data uses/research projects related to specific datasets and other features"
                )
            ).toBeInTheDocument();
        });
    });
});
