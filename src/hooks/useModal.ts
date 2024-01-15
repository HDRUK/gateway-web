import { useContext } from "react";
import Modal from "@/components/Modal";
import {
    GlobalDialogContext,
    dialogPropsType,
} from "@/providers/DialogProvider";

const useModal = () => {
    const { showDialog, hideDialog, ...rest } = useContext(GlobalDialogContext);

    return {
        showModal: (props: dialogPropsType | undefined): void => {
            showDialog(Modal, props);
        },
        hideModal: hideDialog,
        ...rest,
    };
};

export default useModal;
