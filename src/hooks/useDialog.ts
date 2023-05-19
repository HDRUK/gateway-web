import { GlobalDialogContext } from "@/providers/Dialog/DialogProvider";
import { useContext } from "react";

const useDialog = () => {
    return useContext(GlobalDialogContext);
};

export default useDialog;
