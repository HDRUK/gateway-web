import { useEffect } from "react";
import { useGatewayStore } from "@/store/useGatewayStore";

const useImageLightbox = (containerIds: string[]) => {
    const { SetLightBoxImage } = useGatewayStore();

    useEffect(() => {
        const cleanupCallbacks: (() => void)[] = [];

        containerIds.forEach(id => {
            const container = document.getElementById(id);
            if (!container) return;

            const images = Array.from(container.querySelectorAll("img"));

            images.forEach(img => {
                const image = img as HTMLImageElement;
                const getHighestSrcFromSrcset = (
                    srcset: string | null
                ): string => {
                    if (!srcset) return img.src;

                    const entries = srcset
                        .split(",")
                        .map(entry => entry.trim().split(" "))
                        .filter(entry => entry.length >= 1);

                    const lastEntry = entries[entries.length - 1];
                    return lastEntry?.[0] ?? img.src;
                };

                const handleClick = () => {
                    const src = getHighestSrcFromSrcset(
                        img.getAttribute("srcset")
                    );
                    SetLightBoxImage({
                        src,
                        alt: img.alt,
                    });
                };

                const handleKeydown = (e: KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClick();
                    }
                };

                image.style.cursor = "pointer";
                image.tabIndex = 0;

                image.addEventListener("click", handleClick);
                image.addEventListener("keydown", handleKeydown);

                cleanupCallbacks.push(() => {
                    image.removeEventListener("click", handleClick);
                    image.removeEventListener("keydown", handleKeydown);
                });
            });
        });

        return () => {
            cleanupCallbacks.forEach(fn => fn());
        };
    }, [containerIds, SetLightBoxImage]);
};

export default useImageLightbox;
