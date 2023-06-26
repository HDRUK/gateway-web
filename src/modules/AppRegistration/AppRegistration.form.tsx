import Button from "@/components/Button";
import useActionBar from "@/hooks/useActionBar";
import AppRegistrationActionBar from "./AppRegistration.actionBar";

const AppRegistrationForm = () => {
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
                    showBar("AppRegistration", {
                        component: AppRegistrationActionBar,
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

export default AppRegistrationForm;
