/* eslint-disable react/prop-types */
import React, { ReactNode } from "react";
import ActionBar from "@/components/ActionBar";
import useActionBar from "@/hooks/useActionBar";
import Button from "@/components/Button";
import { fireEvent, render, screen, waitFor } from "../testUtils";

const onSuccess = jest.fn();

describe("ActionBar", () => {
    const Content = () => {
        const { store } = useActionBar();
        const { props } = store;
        const { otherProp } = props as { otherProp: ReactNode };
        return <p>Content here: {otherProp}</p>;
    };

    const WrapperComponent = () => {
        const { showBar, hideBar } = useActionBar();

        return (
            <div>
                <Button
                    onClick={() =>
                        showBar("StoryComponent", {
                            otherProp: "other prop",
                            component: Content,
                            cancelText: "Discard",
                            confirmText: "Save",
                            onSuccess: () => onSuccess(),
                            onCancel: () => hideBar(),
                        })
                    }>
                    show action bar
                </Button>
                <ActionBar />
            </div>
        );
    };
    it("should render action bar content", async () => {
        render(<WrapperComponent />);

        fireEvent.click(screen.getByText("show action bar"));

        expect(
            screen.getByText("Content here: other prop")
        ).toBeInTheDocument();
    });
    it("should close action bar", async () => {
        render(<WrapperComponent />);

        fireEvent.click(screen.getByText("show action bar"));
        await waitFor(() => {
            expect(
                screen.getByText("Content here: other prop")
            ).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Discard"));
        await waitFor(() => {
            expect(
                screen.queryByText("Content here: other prop")
            ).not.toBeInTheDocument();
        });
    });
    it("should call onSuccess", async () => {
        render(<WrapperComponent />);

        fireEvent.click(screen.getByText("show action bar"));
        await waitFor(() => {
            expect(
                screen.getByText("Content here: other prop")
            ).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Save"));
        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalled();
        });
    });
});
