import React from "react";
import ActiveList from "@/components/ActiveList";
import { fireEvent, render, screen } from "@/utils/testUtils";

describe("ActiveList", () => {
    const handleClickFn = jest.fn();

    it("should render component", async () => {
        render(
            <ActiveList
                activeItem={1}
                handleClick={handleClickFn}
                items={[{ label: "Item one" }, { label: "Item two" }]}
            />
        );

        expect(screen.getByText("Item one")).toBeInTheDocument();
        expect(screen.getByText("Item two")).toBeInTheDocument();
        expect(screen.getAllByTestId("CircleIcon")).toHaveLength(2);
    });
    it("should call handleClick with index", async () => {
        render(
            <ActiveList
                activeItem={1}
                handleClick={handleClickFn}
                items={[{ label: "Item one" }, { label: "Item two" }]}
            />
        );

        fireEvent.click(screen.getByText("Item two"));
        expect(handleClickFn).toHaveBeenCalledWith(2);
    });
});
