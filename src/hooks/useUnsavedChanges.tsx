import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { ModalProps } from "@/components/Modal/Modal";
import useModal from "./useModal";

export interface UnsavedChangesDialogProps {
    shouldConfirmLeave: boolean;
    onCancel?: () => void;
    onSuccess?: () => void;
    modalProps: ModalProps;
}

export const useUnsavedChanges = (props: UnsavedChangesDialogProps): void => {
    const { showModal } = useModal();
    const Router = useRouter();
    const [nextRouterPath, setNextRouterPath] = useState<string>("");

    const onRouteChangeStart = useCallback(
        (nextPath: string) => {
            if (!props.shouldConfirmLeave) {
                return;
            }

            setNextRouterPath(nextPath);

            throw Error("cancelRouteChange");
        },
        [props.shouldConfirmLeave]
    );

    useEffect(() => {
        if (!nextRouterPath) return;
        showModal({
            onCancel: () => {
                Router.events.off("routeChangeStart", onRouteChangeStart);

                setNextRouterPath("");
                if (typeof props.onCancel === "function") {
                    props.onCancel();
                }

                if (nextRouterPath) {
                    Router.push(nextRouterPath);
                }
            },
            onSuccess: () => {
                setNextRouterPath("");
                if (typeof props.onSuccess === "function") {
                    props.onSuccess();
                }
            },
            ...props.modalProps,
        });
    }, [Router, nextRouterPath, onRouteChangeStart, props, showModal]);

    useEffect(() => {
        Router.events.on("routeChangeStart", onRouteChangeStart);

        return () => Router.events.off("routeChangeStart", onRouteChangeStart);
    }, [Router, onRouteChangeStart]);
};
