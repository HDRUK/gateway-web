import type { Meta, StoryObj } from "@storybook/react";
import useActionBar from "@/hooks/useActionBar";
import Button from "@/components/Button";
import ActionBar from "./ActionBar";

const meta: Meta<typeof ActionBar> = {
    component: ActionBar,
};

export default meta;

type Story = StoryObj<typeof ActionBar>;

const Content = () => {
    return <p>Content here</p>;
};

const WrapperComponent = () => {
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
            <ActionBar />
        </div>
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
