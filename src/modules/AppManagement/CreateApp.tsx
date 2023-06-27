import Button from "@/components/Button";
import useActionBar from "@/hooks/useActionBar";
import CreateAppActionBar from "./CreateApp.actionBar";

const CreateApp = () => {
    const { showBar, hideBar } = useActionBar();

    const onSuccess = () => {
        hideBar();
    };

    const onCancel = () => {
        hideBar();
    };

    return (
        <div>
            <Button
                onClick={() =>
                    showBar("CreateApp", {
                        component: CreateAppActionBar,
                        cancelText: "Discard",
                        confirmText: "Save",
                        onSuccess,
                        onCancel,
                    })
                }>
                show action bar
            </Button>
        </div>
    );
};

export default CreateApp;
