import { AppsIcon, ViewListIcon } from "@/consts/icons";
import { render, screen } from "@/utils/testUtils";
import ToggleTabs from "./ToggleTabs";

describe("ToggleTabs", () => {
    it("should render component", () => {
        render(
            <ToggleTabs
                selected="table"
                buttons={[
                    {
                        icon: AppsIcon,
                        label: "Table",
                        value: "table",
                    },
                    {
                        icon: ViewListIcon,
                        label: "List",
                        value: "list",
                    },
                ]}
            />
        );

        expect(screen.getByText("table")).toBeInTheDocument();
        expect(screen.getByTestId("AppsIcon")).toBeInTheDocument();
        expect(screen.getByText("list")).toBeInTheDocument();
        expect(screen.getByTestId("ViewListIcon")).toBeInTheDocument();
    });
});
