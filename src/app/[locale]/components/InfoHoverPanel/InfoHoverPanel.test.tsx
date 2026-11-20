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
        expect(
            screen.getByRole("link", { name: "Datasets & BioSamples" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "Data Uses / Research Projects" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", {
                level: 1,
                name: "Welcome to the Gateway",
            })
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

        const dur = screen.getByRole("link", {
            name: "Data Uses / Research Projects",
        });
        userEvent.hover(dur);

        await waitFor(() => {
            expect(
                screen.getByRole("heading", {
                    level: 1,
                    name: "Data Uses / Research Projects",
                })
            ).toBeInTheDocument();
        });
    });
});
