import { create } from "zustand";

export interface LightBoxImage {
    src: string;
    alt: string;
    sizes?: string;
    title?: string;
}
export interface DTAState {
    lightBoxImage: LightBoxImage | undefined;
    SetLightBoxImage: (param: LightBoxImage | undefined) => void;
}

export const useGatewayStore = create<DTAState>(set => ({
    lightBoxImage: undefined,
    SetLightBoxImage: param => {
        set({
            lightBoxImage: param,
        });
    },
}));
