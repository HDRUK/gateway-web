import React from "react";
import SortIcon from "@/components/SortIcon";
import { fireEvent, render, screen } from "@/utils/testUtils";

describe("SortIcon", () => {
    const setSortFn = jest.fn();
    const sort = { key: "mockKey", direction: "asc" };

    it("should render component with default icon", async () => {
        render(
            <SortIcon
                setSort={setSortFn}
                sort={sort}
                sortKey="mockKey"
                ariaLabel="mockAriaLabel"
            />
        );

        expect(screen.getByTestId("StockUpIcon")).toBeInTheDocument();
    });
    it("should call setSort with updated direction", async () => {
        render(
            <SortIcon
                setSort={setSortFn}
                sort={sort}
                sortKey="mockKey"
                ariaLabel="mockAriaLabel"
            />
        );

        fireEvent.click(screen.getByTestId("StockUpIcon"));
        expect(setSortFn).toBeCalledWith({ direction: "desc", key: "mockKey" });
    });
});
