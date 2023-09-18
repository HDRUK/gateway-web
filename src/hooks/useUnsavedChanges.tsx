import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { ModalProps } from "@/components/Modal/Modal";
import useModal from "./useModal";

export interface UnsavedChangesDialogProps {
    shouldConfirmLeave: boolean;
    onSuccess: () => void;
    modalProps: ModalProps;
}

export const useUnsavedChanges = ({
    shouldConfirmLeave,
    onSuccess,
    modalProps,
}: UnsavedChangesDialogProps): void => {
    const { showModal } = useModal();
    const [nextRouterPath, setNextRouterPath] = useState<string>("");

    const Router = useRouter();

    const onRouteChangeStart = useCallback(
        (nextPath: string) => {
            if (!shouldConfirmLeave) {
                return;
            }

            showModal({
                onCancel: () => {
                    Router.events.off("routeChangeStart", onRouteChangeStart);

                    // todo: why is nextRouterPath empty
                    console.log("nextRouterPath: ", nextRouterPath);
                    if (nextRouterPath) {
                        Router.push(nextRouterPath);
                    }
                },
                onSuccess: () => {
                    setNextRouterPath("");
                    if (typeof onSuccess === "function") {
                        onSuccess();
                    }
                },
                ...modalProps,
            });
            setNextRouterPath(nextPath);

            throw Error("cancelRouteChange");
        },
        [shouldConfirmLeave]
    );

    useEffect(() => {
        Router.events.on("routeChangeStart", onRouteChangeStart);

        return () => Router.events.off("routeChangeStart", onRouteChangeStart);
    }, [onRouteChangeStart]);
};
