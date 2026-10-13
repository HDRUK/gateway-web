import { ReactNode } from "react";
import { FeatureProvider, FeatureType } from "@/providers/FeatureProvider";
import { renderHook } from "@/utils/testUtils";
import useLoginProviders from "./useLoginProviders";

const withFeatures = (features: FeatureType) => ({
    wrapper: ({ children }: { children: ReactNode }) => (
        <FeatureProvider feature={features}>{children}</FeatureProvider>
    ),
});

describe("useLoginProviders", () => {
    it("leaves a provider available when nothing has stored its flag", () => {
        const { result } = renderHook(() => useLoginProviders(), {
            ...withFeatures({}),
            wrapperProps: {},
        });

        expect(result.current.google).toBe(true);
        expect(result.current.azure).toBe(true);
        expect(result.current.linkedIn).toBe(true);
        expect(result.current.openAthens).toBe(true);
        expect(result.current.any).toBe(true);
    });

    it("keeps Registry hidden until it is explicitly released", () => {
        const { result } = renderHook(() => useLoginProviders(), {
            ...withFeatures({}),
            wrapperProps: {},
        });

        expect(result.current.registry).toBe(false);
    });

    it("turns off only the provider whose flag is off", () => {
        const { result } = renderHook(() => useLoginProviders(), {
            ...withFeatures({ isLoginAzureEnabled: false }),
            wrapperProps: {},
        });

        expect(result.current.azure).toBe(false);
        expect(result.current.google).toBe(true);
        expect(result.current.any).toBe(true);
    });

    it("reports nothing available once every provider is off", () => {
        const { result } = renderHook(() => useLoginProviders(), {
            ...withFeatures({
                isLoginAzureEnabled: false,
                isLoginGoogleEnabled: false,
                isLoginLinkedInEnabled: false,
                isLoginOpenAthensEnabled: false,
            }),
            wrapperProps: {},
        });

        expect(result.current.any).toBe(false);
    });

    it("overrides every provider while login is globally disabled", () => {
        const { result } = renderHook(() => useLoginProviders(), {
            ...withFeatures({
                isLoginDisabled: true,
                isSafePeopleRegistrySSOEnabled: true,
            }),
            wrapperProps: {},
        });

        expect(result.current.any).toBe(false);
        expect(result.current.registry).toBe(false);
    });
});
