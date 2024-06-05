import React, { useState } from "react";
import { Option } from "@/interfaces/Option";
import { render, screen, fireEvent } from "@/utils/testUtils";
import SelectMultipleOption from "./SelectMultipleOption";

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
            <SelectMultipleOption
                id={1}
                option={options[0]}
                setOptions={setOptions}
            />
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render component", async () => {
        render(<Component />);
        expect(screen.getByDisplayValue(OPTIONS[0].label)).toBeInTheDocument();
    });

    it("should render component and display updated value", async () => {
        render(<Component />);

        const input = screen.getByPlaceholderText("label");

        // Simulate user typing in the input
        fireEvent.change(input, { target: { value: "Updated Value" } });

        expect(screen.getByDisplayValue("Updated Value")).toBeInTheDocument();
    });
});
