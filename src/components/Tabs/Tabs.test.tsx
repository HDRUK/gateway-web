import React from "react";
import Tabs from "@/components/Tabs";
import { fireEvent, render, screen } from "@/utils/testUtils";

describe("Tabs", () => {
    const tabs = [
        {
            label: "This is a label 1",
            value: "1",
            content: <div>This is content 1</div>,
        },
        {
            label: "This is a label 2",
            value: "2",
            content: <div>This is content 2</div>,
        },
    ];
    it("should render tab labels and content", async () => {
        render(<Tabs value="1" onChange={() => null} tabs={tabs} />);

        expect(screen.getByText("This is a label 1")).toBeInTheDocument();
        expect(screen.getByText("This is content 1")).toBeInTheDocument();
        expect(screen.getByText("This is a label 2")).toBeInTheDocument();
        expect(screen.queryByText("This is content 2")).not.toBeInTheDocument();
    });
    it("should call onChange with selected tab value", async () => {
        const onChange = jest.fn();

        render(<Tabs value="1" onChange={onChange} tabs={tabs} />);

        fireEvent.click(screen.getByText("This is a label 2"));

        expect(onChange).toBeCalledWith("2");
    });
});
