import { render } from "@/utils/testUtils";
import mockRouter from "next-router-mock";
import LeftNav from "./LeftNav";

describe("LeftNav", () => {
    const mockNavItems = [
        {
            label: "Item 1",
            href: "/item1",
            icon: <svg />,
        },
        {
            label: "Item 2",
            icon: <svg />,
            subItems: [
                {
                    label: "SubItem 1",
                    href: "/subitem1",
                },
                {
                    label: "SubItem 2",
                    href: "/subitem2",
                },
            ],
        },
    ];

    it("renders the navigation items", () => {
        mockRouter.push("/initial-path");
        const { getByText, queryByText } = render(
            <LeftNav navItems={mockNavItems} />
        );

        expect(getByText("Item 1")).toBeInTheDocument();
        expect(getByText("Item 2")).toBeInTheDocument();
        expect(queryByText("SubItem 1")).not.toBeInTheDocument();
        expect(queryByText("SubItem 2")).not.toBeInTheDocument();
    });

    it("renders expanded items", () => {
        mockRouter.push("/subitem1");

        const { getByText } = render(<LeftNav navItems={mockNavItems} />);

        expect(getByText("SubItem 1")).toBeInTheDocument();
        expect(getByText("SubItem 2")).toBeInTheDocument();
    });
});
