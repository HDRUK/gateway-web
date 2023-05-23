import Modal from "@/components/Modal";
import {
    GlobalDialogContext,
    dialogPropsType,
} from "@/providers/Dialog/DialogProvider";
import { useContext } from "react";

const useModal = () => {
    const { showDialog, hideDialog, ...rest } = useContext(GlobalDialogContext);

    return {
        showModal: (props: dialogPropsType | undefined) =>
            showDialog(Modal, props),
        hideModal: hideDialog,
        ...rest,
    };
};

export default useModal;
