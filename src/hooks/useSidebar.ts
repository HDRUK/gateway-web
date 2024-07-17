import { useContext } from "react";
import Sidebar from "@/components/Sidebar";
import { GlobalDialogContext } from "@/providers/DialogProvider";
import { sidebarPropsType } from "@/providers/SidebarProvider";

const useSidebar = () => {
    const { showDialog, hideDialog, store, ...rest } =
        useContext(GlobalDialogContext);

    return {
        showSidebar: (props: sidebarPropsType | undefined): void => {
            showDialog(Sidebar, props);
        },
        hideSidebar: hideDialog,
        ...rest,
    };
};

export default useSidebar;
