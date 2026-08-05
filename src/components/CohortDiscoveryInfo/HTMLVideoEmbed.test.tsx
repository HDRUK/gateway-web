import HTMLVideoEmbed from "./HTMLVideoEmbed";
import { render } from "@/utils/testUtils";

const IFRAME = '<iframe src="https://www.youtube.com/embed/abc123"></iframe>';

describe("HTMLVideoEmbed", () => {
    it.each([
        ["undefined", undefined],
        ["an empty string", ""],
    ])("renders nothing when content is %s", (_label, content) => {
        const { container } = render(<HTMLVideoEmbed content={content} />);

        expect(container).toBeEmptyDOMElement();
    });

    it("renders the embed inside a responsive wrapper", () => {
        const { container } = render(<HTMLVideoEmbed content={IFRAME} />);

        const iframe = container.querySelector("iframe");

        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute(
            "src",
            "https://www.youtube.com/embed/abc123"
        );
    });

    it("strips unsafe markup from CMS content", () => {
        const { container } = render(
            <HTMLVideoEmbed content={`${IFRAME}<script>alert(1)</script>`} />
        );

        expect(container.querySelector("script")).not.toBeInTheDocument();
        expect(container.querySelector("iframe")).toBeInTheDocument();
    });
});
