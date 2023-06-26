import Button from "@/components/Button";
import useActionBar from "@/hooks/useActionBar";
import AppRegActionBar from "../actionBars/AppRegActionBar";

const AppRegistrationForm = () => {
    const { showBar, hideBar } = useActionBar();

    const onSuccess = () => {
        hideBar();
    };

    return (
        <div>
            <Button
                onClick={() =>
                    showBar(AppRegActionBar, {
                        status: "draft",
                        text: "1/12 questions answered in this section",
                        onSuccess,
                    })
                }>
                show action bar
            </Button>
        </div>
    );
};

export default AppRegistrationForm;
