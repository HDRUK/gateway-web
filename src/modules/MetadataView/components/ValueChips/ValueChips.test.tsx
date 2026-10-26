import { render, screen } from "@/utils/testUtils";
import { RendererProps } from "../../types";
import { resolveSchemaNode } from "../../utils/resolveSchemaNode";
import ValueChips from "./ValueChips";

const props = (value: unknown): RendererProps => ({
    value,
    resolved: resolveSchemaNode({ type: "string" }, {}),
    rootSchema: {},
    depth: 0,
    renderDefault: () => null,
    render: () => null,
});

describe("ValueChips", () => {
    it("splits a ;,; delimited string into one chip per item", () => {
        render(<ValueChips {...props("Primary care;,;GP;,;SAIL")} />);

        expect(screen.getByText("Primary care")).toBeInTheDocument();
        expect(screen.getByText("GP")).toBeInTheDocument();
        expect(screen.getByText("SAIL")).toBeInTheDocument();
    });

    it("renders one chip per array item", () => {
        const { container } = render(
            <ValueChips {...props(["DUO:0000007", "DUO:0000042"])} />
        );

        expect(screen.getByText("DUO:0000007")).toBeInTheDocument();
        expect(screen.getByText("DUO:0000042")).toBeInTheDocument();
        expect(container.querySelectorAll(".MuiChip-root")).toHaveLength(2);
    });

    it("renders a single-value list as plain text, not one chip", () => {
        const { container } = render(<ValueChips {...props(["Study"])} />);

        expect(screen.getByText("Study")).toBeInTheDocument();
        expect(container.querySelector(".MuiChip-root")).toBeNull();
    });

    it("drops empty array items", () => {
        render(<ValueChips {...props(["GP", "", null])} />);

        expect(screen.getAllByText(/./)).toHaveLength(1);
    });

    it("renders a lone scalar as plain text", () => {
        const { container } = render(<ValueChips {...props("GP")} />);

        expect(screen.getByText("GP")).toBeInTheDocument();
        expect(container.querySelector(".MuiChip-root")).toBeNull();
    });
});
