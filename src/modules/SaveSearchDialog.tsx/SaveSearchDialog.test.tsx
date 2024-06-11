import React from "react";
import { faker } from "@faker-js/faker";
import { act, fireEvent, render, screen, waitFor } from "@/utils/testUtils";
import SaveSearchDialog, { SaveSearchDialogProps } from "./SaveSearchDialog";

const mockSubmit = jest.fn();
const mockCancel = jest.fn();

const renderSaveSearchDialog = (props?: Partial<SaveSearchDialogProps>) =>
    render(
        <SaveSearchDialog
            onSubmit={mockSubmit}
            onCancel={mockCancel}
            {...props}
        />
    );

describe("SaveSearchDialog", () => {
    it("should render component title", async () => {
        renderSaveSearchDialog();

        await waitFor(() => {
            expect(
                screen.getByText("Name your search query")
            ).toBeInTheDocument();
        });
    });

    it("does not submit when values are not defined", async () => {
        renderSaveSearchDialog();

        act(() => {
            fireEvent.submit(
                screen.getByRole("button", { name: /Save query/i })
            );
        });

        expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("submits when values are defined", async () => {
        renderSaveSearchDialog();

        const name = screen
            .getByLabelText("Name your search query")
            .querySelector("input");

        const nameValue = faker.lorem.words();

        if (name) {
            await act(() => {
                fireEvent.change(name, {
                    target: {
                        value: nameValue,
                    },
                });

                fireEvent.submit(
                    screen.getByRole("button", { name: /Save query/i })
                );
            });

            expect(mockSubmit).toHaveBeenCalled();
        } else {
            fail("Name do not exist");
        }
    });

    it("calls cancel when clicked", async () => {
        renderSaveSearchDialog();

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
        });

        expect(mockCancel).toHaveBeenCalled();
    });
});
