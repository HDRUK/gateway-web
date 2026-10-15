import mediaQuery from "css-mediaquery";
import mockRouter from "next-router-mock";
import { fireEvent, render, screen } from "@/utils/testUtils";
import ActiveListSidebar from "./ActiveListSidebar";

type MatchMedia = (query: string) => MediaQueryList;

function createMatchMedia(width: number): MatchMedia {
    return (query: string): MediaQueryList => ({
        matches: mediaQuery.match(query, { width }),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    });
}

function setScreenWidth(width: number) {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: createMatchMedia(width),
    });
}

const items = [{ label: "Summary" }, { label: "Documentation" }];

describe("ActiveListSidebar", () => {
    let section: HTMLDivElement;

    beforeEach(() => {
        mockRouter.setCurrentUrl("/en/dataset/123");
        window.scrollTo = jest.fn();

        section = document.createElement("div");
        section.id = "anchor2";
        section.scrollIntoView = jest.fn();
        section.getBoundingClientRect = jest
            .fn()
            .mockReturnValue({ top: 500 } as DOMRect);
        document.body.appendChild(section);
    });

    afterEach(() => {
        document.body.removeChild(section);
    });

    it("scrolls the section into view on desktop so its scroll margin is respected", () => {
        setScreenWidth(1440);
        render(<ActiveListSidebar items={items} />);

        fireEvent.click(screen.getByRole("button", { name: "Documentation" }));

        expect(section.scrollIntoView).toHaveBeenCalledWith({
            behavior: "smooth",
            block: "start",
        });
        expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it("scrolls to the section minus the mobile offset on mobile", () => {
        setScreenWidth(390);
        render(<ActiveListSidebar items={items} />);

        fireEvent.click(
            screen.getByRole("button", { name: "Open to select bookmark" })
        );
        fireEvent.click(
            screen.getByRole("menuitem", { name: "Documentation" })
        );

        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 440,
            behavior: "smooth",
        });
        expect(section.scrollIntoView).not.toHaveBeenCalled();
    });
});
