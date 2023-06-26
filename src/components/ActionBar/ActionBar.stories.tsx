import type { Meta, StoryObj } from "@storybook/react";
import useActionBar from "@/hooks/useActionBar";
import ActionBarComponent from "./ActionBar";
import Button from "../Button";

const meta: Meta<typeof ActionBarComponent> = {
    component: ActionBarComponent,
};

export default meta;

type Story = StoryObj<typeof ActionBarComponent>;

const Content = () => {
    return <p>Content here</p>;
};

const DummyComponent = () => {
    const { showBar, hideBar } = useActionBar();

    return (
        <div>
            <Button
                onClick={() =>
                    showBar("StoryComponent", {
                        component: Content,
                        cancelText: "Discard",
                        confirmText: "Save",
                        onSuccess: () => hideBar(),
                        onCancel: () => hideBar(),
                    })
                }>
                show action bar
            </Button>
            <ActionBarComponent />
        </div>
    );
};

export const ActionBar: Story = {
    render: () => <DummyComponent />,
};
