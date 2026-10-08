import userEvent from "@testing-library/user-event";
import { render, screen } from "@/utils/testUtils";
import DatasetStatCard, { DatasetStatCardProps } from "./DatasetStatCard";

const renderTest = (props?: Partial<DatasetStatCardProps>) =>
    render(
        <DatasetStatCard
            iconSrc="/test.jpg"
            title="A description"
            stat="10"
            largeStatText
            unit="days"
            helperText="helper"
            noStatText="Fallback text"
            {...props}
        />
    );

describe("DatasetStatCard", () => {
    it("should match snapshot", async () => {
        const wrapper = renderTest();

        expect(wrapper.container).toMatchSnapshot();
    });

    it("should be a button when it scrolls to a section", () => {
        renderTest({
            enableScroll: true,
            targetScroll: "anchor-Coverage",
            helperText: undefined,
        });

        expect(screen.getByRole("button")).toHaveAttribute("tabindex", "0");
    });

    it("should not be focusable when there is nowhere to scroll", () => {
        const { container } = renderTest({
            enableScroll: false,
            helperText: undefined,
        });

        expect(screen.queryByRole("button")).not.toBeInTheDocument();
        expect(container.querySelector("[tabindex]")).toBeNull();
    });

    it("should not scroll on click when it has helper text", async () => {
        const section = document.createElement("div");
        section.id = "anchor-Coverage";
        section.scrollIntoView = jest.fn();
        document.body.appendChild(section);

        renderTest({ enableScroll: true, targetScroll: "anchor-Coverage" });

        await userEvent.click(screen.getByText("A description"));

        expect(
            screen.queryByRole("button", { name: /A description/ })
        ).not.toBeInTheDocument();
        expect(section.scrollIntoView).not.toHaveBeenCalled();

        section.remove();
    });

    it("shows no stat fallback text", async () => {
        renderTest({
            stat: "",
        });

        expect(screen.getByText("Fallback text")).toBeInTheDocument();
    });
});
