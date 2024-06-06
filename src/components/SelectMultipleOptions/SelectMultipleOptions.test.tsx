import React, { useState } from "react";
import { Option } from "@/interfaces/Option";
import { render, screen, fireEvent } from "@/utils/testUtils";
import SelectMultipleOptions from "./SelectMultipleOptions";

const OPTIONS = [
    { label: "Red", value: 1 },
    { label: "Green", value: 2 },
    { label: "Blue", value: 3 },
    { label: "Yellow", value: 4 },
];

describe("SelectMultipleOption", () => {
    const Component = () => {
        const [options, setOptions] = useState<Option[]>(OPTIONS);

        return (
            <SelectMultipleOptions options={options} setOptions={setOptions} />
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render component", async () => {
        render(<Component />);
        expect(screen.getByDisplayValue(OPTIONS[0].label)).toBeInTheDocument();
        expect(screen.getByDisplayValue(OPTIONS[1].label)).toBeInTheDocument();
        expect(screen.getByDisplayValue(OPTIONS[2].label)).toBeInTheDocument();
        expect(screen.getByDisplayValue(OPTIONS[3].label)).toBeInTheDocument();
    });

    it("should remove option on click", async () => {
        render(<Component />);
        expect(screen.getByDisplayValue(OPTIONS[0].label)).toBeInTheDocument();
        let removeButton = screen.getByTestId(`remove-${OPTIONS[0].value}`);
        fireEvent.click(removeButton);
        expect(
            screen.queryByDisplayValue(OPTIONS[0].label)
        ).not.toBeInTheDocument();

        expect(screen.getByDisplayValue(OPTIONS[1].label)).toBeInTheDocument();
        expect(screen.getByDisplayValue(OPTIONS[2].label)).toBeInTheDocument();
        expect(screen.getByDisplayValue(OPTIONS[3].label)).toBeInTheDocument();

        expect(
            screen.queryByTestId(`remove-${OPTIONS[0].value}`)
        ).not.toBeInTheDocument();

        removeButton = screen.getByTestId(`remove-${OPTIONS[1].value}`);
        fireEvent.click(removeButton);
        expect(
            screen.queryByDisplayValue(OPTIONS[1].label)
        ).not.toBeInTheDocument();
    });

    it("should add option on click", async () => {
        render(<Component />);
        const addButton = screen.getByTestId(
            `add-after-${OPTIONS[OPTIONS.length - 1].value}`
        );
        fireEvent.click(addButton);
        expect(
            screen.queryByTestId(`input-new-option-${OPTIONS.length + 1}`)
        ).toBeInTheDocument();

        const input = screen
            .getByTestId(`input-new-option-${OPTIONS.length + 1}`)
            .querySelector("input");

        fireEvent.change(input, { target: { value: "Updated Value" } });

        expect(screen.getByDisplayValue("Updated Value")).toBeInTheDocument();
    });
});
