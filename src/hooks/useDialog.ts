import { useContext } from "react";
import { GlobalDialogContext } from "@/providers/DialogProvider";

const useDialog = () => {
    return useContext(GlobalDialogContext);
};

export default useDialog;
