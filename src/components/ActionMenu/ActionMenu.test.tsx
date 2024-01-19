import React from "react";
import ActionMenu from "@/components/ActionMenu";
import { CloseIcon, EditIcon } from "@/consts/icons";
import { fireEvent, render, screen } from "@/utils/testUtils";

describe("ActionMenu", () => {
    const handleDeleteFn = jest.fn();
    const handleEditFn = jest.fn();
    const actions = [
        { label: "Edit", action: handleEditFn, icon: EditIcon },
        { label: "Delete", action: handleDeleteFn, icon: CloseIcon },
    ];

    it("should render component", async () => {
        render(<ActionMenu label="Label" actions={actions} />);

        expect(screen.getByText("Label")).toBeInTheDocument();
    });
    it("should open menu", async () => {
        render(<ActionMenu label="Label" actions={actions} />);

        const button = screen.getByText("Label");

        fireEvent.click(button);

        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByTestId("EditIcon")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
        expect(screen.getByTestId("CloseIcon")).toBeInTheDocument();
    });
    it("should call edit function", async () => {
        render(<ActionMenu label="Label" actions={actions} />);

        const button = screen.getByText("Label");

        fireEvent.click(button);

        const editButton = screen.getByText("Edit");

        fireEvent.click(editButton);

        expect(handleEditFn).toHaveBeenCalled();
    });
    it("should call delete function", async () => {
        render(<ActionMenu label="Label" actions={actions} />);

        const button = screen.getByText("Label");

        fireEvent.click(button);

        const editButton = screen.getByText("Delete");

        fireEvent.click(editButton);

        expect(handleDeleteFn).toHaveBeenCalled();
    });
});
