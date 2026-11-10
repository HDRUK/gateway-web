import { useEffect, useId } from "react";
import { PROGRESS_END_EVENT, PROGRESS_START_EVENT } from "@/consts/navigation";

const useNavigationProgress = (isLoading: boolean) => {
    const source = useId();

    useEffect(() => {
        if (!isLoading) {
            return undefined;
        }

        window.dispatchEvent(
            new CustomEvent(PROGRESS_START_EVENT, { detail: source })
        );

        return () => {
            window.dispatchEvent(
                new CustomEvent(PROGRESS_END_EVENT, { detail: source })
            );
        };
    }, [isLoading, source]);
};

export default useNavigationProgress;
