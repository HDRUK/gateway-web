import { CollectionItem } from "@/interfaces/Widget";
import { render, screen } from "@/utils/testUtils";
import CollectionsGrid from "./CollectionGrid";

const GATEWAY_URL = "https://healthdatagateway.org/en";
const FALLBACK_IMG =
    "https://media.prod.hdruk.cloud/static/default_placeholder.png";

const items: CollectionItem[] = [
    {
        id: 75,
        name: "Alleviate",
        image_link:
            "https://media.preprod.hdruk.cloud/collections/1753891478_dpuk-2-2.png",
    },
    {
        id: 159,
        name: "Testing Long Collection Name",
        image_link: "",
    },
];

describe("CollectionsGrid", () => {
    it("renders all items with labels and links", () => {
        render(<CollectionsGrid items={items} />);

        // Links use Chip text as accessible name
        expect(
            screen.getByRole("link", { name: "Alleviate" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "Testing Long Collection Name" })
        ).toBeInTheDocument();

        // Ensure correct hrefs
        expect(screen.getByRole("link", { name: "Alleviate" })).toHaveAttribute(
            "href",
            `${GATEWAY_URL}/collection/75`
        );
        expect(
            screen.getByRole("link", { name: "Testing Long Collection Name" })
        ).toHaveAttribute("href", `${GATEWAY_URL}/collection/159`);

        // Opens in new tab
        expect(screen.getByRole("link", { name: "Alleviate" })).toHaveAttribute(
            "target",
            "_blank"
        );
    });

    it("applies background images (custom and fallback) via inline styles", () => {
        render(<CollectionsGrid items={items} />);

        const first = screen.getByRole("link", { name: "Alleviate" });
        const second = screen.getByRole("link", {
            name: "Testing Long Collection Name",
        });

        // Background image is set inline on the link (Box component)
        expect(first).toHaveStyle(
            `background-image: url(${items[0].image_link});`
        );
        expect(second).toHaveStyle(`background-image: url(${FALLBACK_IMG});`);
    });
});
