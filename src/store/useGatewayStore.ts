import { create } from "zustand";

export interface LightBoxImage {
    src: string;
    alt: string;
    sizes?: string;
    title?: string;
}
interface GatewayState {
    lightBoxImage: LightBoxImage | undefined;
    SetLightBoxImage: (param: LightBoxImage | undefined) => void;
}

export const useGatewayStore = create<GatewayState>(set => ({
    lightBoxImage: undefined,
    SetLightBoxImage: param => {
        set({
            lightBoxImage: param,
        });
    },
}));
