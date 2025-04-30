import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/utils/testUtils";
import InfoHoverPanel from "./InfoHoverPanel";

describe("InfoHoverPanel", () => {
    const items = [
        {
            id: "datasets",
            image: "/images/homepage/welcome-image.jpg",
            href: "/search?type=datasets",
        },
        {
            id: "dur",
            image: "/images/homepage/welcome-image.jpg",
            href: "/search?type=dur",
        },
    ];
    const itemResourcess = [
        {
            id: "test",
            image: "/images/homepage/welcome-image.jpg",
            href: "/search?type=test",
        },
    ];

    it("should render default", async () => {
        render(
            <InfoHoverPanel
                defaultImageSrc=""
                items={items}
                itemsResources={itemResourcess}
            />
        );
        expect(screen.getByText("Datasets & BioSamples")).toBeInTheDocument();
        expect(
            screen.getByText("Data Uses / Research Projects")
        ).toBeInTheDocument();
        expect(screen.getByText("Welcome to the Gateway")).toBeInTheDocument();
        expect(
            screen.getByText(
                "The Gateway streamlines the end-to-end user journey to search, discover and request access to the wealth of health and associated Datasets, Analysis Scripts & Software, Publications and Research Projects from across the UK and beyond."
            )
        ).toBeInTheDocument();
    });

    it("should change on hover default", async () => {
        render(
            <InfoHoverPanel
                defaultImageSrc=""
                items={items}
                itemsResources={itemResourcess}
            />
        );

        const dur = screen.getByText("Data Uses / Research Projects");
        userEvent.hover(dur);

        await waitFor(() => {
            expect(
                screen.getByText(
                    "Find Data Uses / Research Projects: search and filter Data Uses / Research Projects related to specific Datasets and other features."
                )
            ).toBeInTheDocument();
        });
    });
});
