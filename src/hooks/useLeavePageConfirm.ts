import { useEffect } from "react";
import Router from "next/router";
import { useBeforeUnload } from "react-use";

export const useLeavePageConfirm = (
    isConfirm = true,
    message = "Are you sure want to leave this page?"
) => {
    useBeforeUnload(isConfirm, message);

    useEffect(() => {
        const handler = () => {
            // eslint-disable-next-line no-alert
            if (isConfirm && !window.confirm(message)) {
                throw new Error("Route Canceled");
            }
        };

        Router.events.on("routeChangeStart", handler);

        return () => {
            Router.events.off("routeChangeStart", handler);
        };
    }, [isConfirm, message]);
};
