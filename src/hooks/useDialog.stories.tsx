import Button from "@/components/Button";
import { TextField } from "@mui/material";
import MuiDialogContent from "@mui/material/DialogContent";
import Dialog from "@/components/Dialog";
import { useForm } from "react-hook-form";
import MuiDialogActions from "@mui/material/DialogActions";
import ModalButtons from "@/components/ModalButtons";
import Box from "@/components/Box";
import useDialog from "./useDialog";

export default { component: useDialog };

const CustomDialog = () => {
    const { hideDialog, store } = useDialog();
    const { register, handleSubmit } = useForm();

    const onFormSubmit = (data: unknown) => {
        if (typeof store.dialogProps?.onSuccess === "function") {
            store.dialogProps.onSuccess(JSON.stringify(data, null, 2));
        }
        hideDialog();
    };

    return (
        <Dialog title="This is a custom dialog">
            <Box
                onSubmit={handleSubmit(onFormSubmit)}
                component="form"
                sx={{
                    p: 0,
                    "& .MuiTextField-root": {
                        m: 1,
                        display: "flex",
                        width: "25ch",
                    },
                }}>
                <MuiDialogContent>
                    <p>
                        Prop from where dialog was invoked:{" "}
                        {store.dialogProps?.foo}
                    </p>
                    <TextField
                        placeholder="Firstname"
                        {...register("firstname")}
                    />
                    <TextField
                        placeholder="Last name"
                        {...register("lastname")}
                    />
                    <p>Submit response to component where modal was invoked.</p>
                </MuiDialogContent>
                <MuiDialogActions>
                    <ModalButtons confirmType="submit" />
                </MuiDialogActions>
            </Box>
        </Dialog>
    );
};

const CustomExample = () => {
    const { showDialog } = useDialog();

    const onSuccess = (data: unknown) => {
        // eslint-disable-next-line no-alert
        alert(data);
    };

    return (
        <Button
            onClick={() => showDialog(CustomDialog, { onSuccess, foo: "bar" })}>
            Open Dialog
        </Button>
    );
};

export const Custom = {
    render: () => <CustomExample />,
};
