import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import ModalButtons from "@/components/ModalButtons";
import useDialog from "./useDialog";

export default { component: useDialog };

const CustomDialog = () => {
    const { hideDialog, store } = useDialog();
    const { dialogProps } = store as unknown as {
        dialogProps: { foo: string };
    };
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
                        Prop from where dialog was invoked: {dialogProps?.foo}
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
