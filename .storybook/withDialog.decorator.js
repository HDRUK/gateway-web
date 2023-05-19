import DialogProvider from "../src/providers/Dialog";

export const withDialog = Story => {
    return (
        <DialogProvider>
            <Story />
        </DialogProvider>
    );
};
