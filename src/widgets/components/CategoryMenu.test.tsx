import { useRef, useState } from "react";
import { WidgetCategory } from "@/interfaces/Widget";
import { fireEvent, render, screen } from "@/utils/testUtils";
import CategoryMenu from "./CategoryMenu";

jest.mock("@/consts/icons", () => ({
    ChevronThinIcon: (props: Record<string, unknown>) => (
        <span data-testid="chevron-icon" {...props} />
    ),
}));

jest.mock("../consts", () => ({
    CATEGORY_LABEL: {
        datasets: "Datasets & Biosamples",
        collections: "Collections",
        data_uses: "Data Uses / Research Projects",
        scripts: "Analysis Scripts & Software",
    },
}));

const OPTIONS: WidgetCategory[] = [
    "datasets",
    "collections",
    "data_uses",
    "scripts",
];

function Wrapper({
    initial = "datasets" as WidgetCategory,
    onChange = jest.fn(),
}: {
    initial?: WidgetCategory;
    onChange?: (cat: WidgetCategory) => void;
}) {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef}>
            <CategoryMenu
                value={initial}
                options={OPTIONS}
                onChange={onChange}
                menuAnchor={menuAnchor}
                setMenuAnchor={setMenuAnchor}
                containerRef={containerRef}
            />
        </div>
    );
}

describe("CategoryMenu", () => {
    it("renders the current category label on the button", () => {
        render(<Wrapper initial="collections" />);
        const button = screen.getByRole("button", {
            name: /open to show search type options/i,
        });
        expect(button).toHaveTextContent("Collections");
        expect(screen.getByTestId("chevron-icon")).toBeInTheDocument();
    });

    it("opens menu and lists all options", async () => {
        render(<Wrapper initial="datasets" />);
        fireEvent.click(
            screen.getByRole("button", {
                name: /open to show search type options/i,
            })
        );

        // All options should be visible as menuitems
        expect(
            await screen.findByRole("menuitem", {
                name: "Datasets & Biosamples",
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("menuitem", { name: "Collections" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("menuitem", {
                name: "Data Uses / Research Projects",
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("menuitem", {
                name: "Analysis Scripts & Software",
            })
        ).toBeInTheDocument();
    });

    it("selecting an option calls onChange and closes the menu", async () => {
        const onChange = jest.fn();
        render(<Wrapper onChange={onChange} />);

        fireEvent.click(
            screen.getByRole("button", {
                name: /open to show search type options/i,
            })
        );
        const collectionsItem = await screen.findByRole("menuitem", {
            name: "Collections",
        });

        fireEvent.click(collectionsItem);

        expect(onChange).toHaveBeenCalledWith("collections");

        expect(
            screen.queryByRole("menuitem", { name: "Collections" })
        ).not.toBeInTheDocument();
    });
});
