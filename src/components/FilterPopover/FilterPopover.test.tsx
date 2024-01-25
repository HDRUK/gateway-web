import React from "react";
import userEvent from "@testing-library/user-event";
import FilterPopover from "@/components/FilterPopover";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";

describe("FilterPopover", () => {
    const setFilterFn = jest.fn();
    const filter = "ALL";
    const radios = [
        { label: "All", value: "ALL" },
        { label: "Other", value: "OTHER" },
    ];

    it("should open popover and render radio buttons", async () => {
        render(
            <FilterPopover
                name="filter_status"
                radios={radios}
                setFilter={setFilterFn}
                filter={filter}
            />
        );

        fireEvent.click(screen.getByTestId("FilterAltIcon"));
        expect(screen.getByText("All")).toBeInTheDocument();
        expect(screen.getByText("Other")).toBeInTheDocument();
    });
    it("should call setFilter with new filter value", async () => {
        render(
            <FilterPopover
                name="filter_status"
                radios={radios}
                setFilter={setFilterFn}
                filter={filter}
            />
        );

        fireEvent.click(screen.getByTestId("FilterAltIcon"));
        expect(screen.getByText("Other")).toBeInTheDocument();

        const radioOptions = screen.getAllByRole("radio");
        userEvent.click(radioOptions[1]);

        await waitFor(() => {
            expect(setFilterFn).toHaveBeenCalledWith("OTHER");
            expect(screen.queryByText("Other")).not.toBeInTheDocument();
        });
    });
});
