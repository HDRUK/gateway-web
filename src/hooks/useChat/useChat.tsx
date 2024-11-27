import { useCallback } from "react";
import ChatSidebar from "@/modules/ChatSidebar";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useDialog from "@/hooks/useDialog";
import useSidebar from "@/hooks/useSidebar";

interface UseGeneralEnquiryProps {
    isLoggedIn: boolean;
    redirectPath?: string | null;
}

const useChat = () => {
    const { showDialog } = useDialog();
    const { showSidebar } = useSidebar();

    return useCallback(
        ({ isLoggedIn, redirectPath = "/" }: UseGeneralEnquiryProps) => {
            if (!isLoggedIn) {
                showDialog(ProvidersDialog, {
                    isProvidersDialog: true,
                    redirectPath,
                });
            } else {
                showSidebar({
                    title: "Chat",
                    content: <ChatSidebar />,
                });
            }
        },
        [showSidebar, showDialog]
    );
};

export default useChat;
