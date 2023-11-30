import { GlobalDialogContext } from "@/providers/DialogProvider";
import { useContext } from "react";

const useDialog = () => {
    return useContext(GlobalDialogContext);
};

export default useDialog;
