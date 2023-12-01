import DialogProvider from "../src/providers/DialogProvider";

export const withDialog = Story => {
    return (
        <DialogProvider>
            <Story />
        </DialogProvider>
    );
};
