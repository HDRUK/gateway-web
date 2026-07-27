import { EditIcon, ArchiveIcon } from "@/consts/icons";
import { render, screen, fireEvent, within } from "@/utils/testUtils";
import CardActions, { CardAction } from "./CardActions";

describe("CardActions", () => {
    const mockAction = jest.fn();

    const actions: CardAction[] = [
        {
            label: "First item",
            icon: EditIcon,
            href: "/this/is/the/href",
        },
        {
            label: "Second item",
            icon: ArchiveIcon,
            action: mockAction,
        },
        {
            label: "Third item",
            icon: ArchiveIcon,
            href: "/duplicate/path",
            query: { duplicate: "true" },
        },
        {
            label: "Fourth item",
            icon: ArchiveIcon,
            href: "/preview/path",
            query: { tab: "preview" },
        },
    ];

    it("should render href action", async () => {
        const { container } = render(<CardActions id={1} actions={actions} />);

        const link = screen.getByRole("link", { name: "First item" });
        expect(link).toHaveAttribute(
            "href",
            expect.stringContaining("/this/is/the/href/1")
        );

        expect(screen.getByTestId("EditIcon")).toBeInTheDocument();

        // original style assertion kept (container query), but tolerant to absolute URL
        const firstLinkEl = container.querySelector("a")!;
        expect(firstLinkEl.getAttribute("href")).toEqual(
            expect.stringContaining("/this/is/the/href/1")
        );
    });

    it("should render onClick action", async () => {
        render(<CardActions id={1} actions={actions} />);

        const btn = screen.getByRole("button", { name: "Second item" });
        expect(btn).toBeInTheDocument();

        expect(within(btn).getByTestId("ArchiveIcon")).toBeInTheDocument();
    });

    it("should call onClick action passing id", async () => {
        render(<CardActions id={1} actions={actions} />);

        const btn = screen.getByRole("button", { name: "Second item" });
        fireEvent.click(btn);

        expect(mockAction).toHaveBeenCalledWith(1);
    });

    it("should apply an action's own query params to its link", async () => {
        render(<CardActions id={10} actions={actions} />);

        const dupLink = screen.getByRole("link", { name: "Third item" });
        expect(dupLink).toHaveAttribute(
            "href",
            expect.stringContaining("/duplicate/path")
        );
        expect(dupLink).toHaveAttribute(
            "href",
            expect.stringContaining("duplicate=true")
        );

        const previewLink = screen.getByRole("link", { name: "Fourth item" });
        expect(previewLink).toHaveAttribute(
            "href",
            expect.stringContaining("tab=preview")
        );
    });

    it("applies the shared query prop to every href action", () => {
        render(
            <CardActions
                id={2}
                actions={actions}
                query={{ status: "DRAFT" }}
            />
        );

        const firstLink = screen.getByRole("link", { name: "First item" });
        expect(firstLink).toHaveAttribute(
            "href",
            expect.stringContaining("status=DRAFT")
        );

        const dupLink = screen.getByRole("link", { name: "Third item" });
        expect(dupLink).toHaveAttribute(
            "href",
            expect.stringContaining("status=DRAFT")
        );
        expect(dupLink).toHaveAttribute(
            "href",
            expect.stringContaining("duplicate=true")
        );
    });
});
