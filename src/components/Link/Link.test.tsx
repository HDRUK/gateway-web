import { render, screen } from "@/utils/testUtils";
import Link from "./Link";

describe("Link", () => {
    it("should render an internal link correctly", () => {
        const href = "/example";
        const textContent = "Example Link";

        const { container } = render(<Link href={href}>{textContent}</Link>);

        const linkElement = container.querySelector("a");
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute("href", href);
        expect(linkElement).toHaveTextContent(textContent);
        expect(linkElement).not.toHaveAttribute("target", "_blank");
        expect(linkElement).not.toHaveAttribute("rel", "noopener");
    });

    it("should render an external link with target _blank and rel noopener", () => {
        const href = "https://example.com";
        const textContent = "External Link";

        render(<Link href={href}>{textContent}</Link>);

        const linkElement = screen.getByRole("link", { name: textContent });
        expect(linkElement).toHaveAttribute("href", href);
        expect(linkElement).toHaveAttribute("target", "_blank");
        expect(linkElement).toHaveAttribute("rel", "noopener");
    });

    it("should support the variant prop", () => {
        const { container } = render(
            <Link href="/test" variant="h6">
                Test Link
            </Link>
        );

        const linkElement = container.querySelector("a");
        console.log(linkElement);
        expect(linkElement).toHaveClass("MuiTypography-h6");
    });

    it("should pass the passHref prop correctly", () => {
        const { container } = render(
            <Link href="/test" passHref>
                Test Link
            </Link>
        );

        const linkElement = container.querySelector("a");
        expect(linkElement).toHaveAttribute("href", "/test");
    });

    it("should accept and pass additional props", () => {
        const { container } = render(
            <Link href="/test" id="custom-id" data-testid="link">
                Test Link
            </Link>
        );

        const linkElement = container.querySelector("#custom-id");
        expect(linkElement).toBeInTheDocument();
        expect(screen.getByTestId("link")).toHaveTextContent("Test Link");
    });
});
