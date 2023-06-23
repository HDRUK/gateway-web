import ActionBar from "@/components/ActionBar";
import Button from "@/components/Button";
import useActionBar from "@/hooks/useActionBar";

const AppRegistrationForm = () => {
    const { showBar } = useActionBar();

    const handleThis = () => {
        console.log("handleThis: ");
    };

    return (
        <div>
            <Button onClick={() => showBar(ActionBar, { handleThis })}>
                show action bar
            </Button>
        </div>
    );
};

export default AppRegistrationForm;
