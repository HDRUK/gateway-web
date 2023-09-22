import { render } from "@/utils/testUtils";
import Link from "./Link";

describe("Link", () => {
    it("should render component", async () => {
        const href = "/example";
        const textContent = "Example Link";

        const { container } = render(<Link href={href}>{textContent}</Link>);

        const linkElement = container.querySelector("a");
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute("href", href);
        expect(linkElement).toHaveTextContent(textContent);
    });
});
