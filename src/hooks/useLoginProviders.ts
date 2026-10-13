"use client";

import { useFeatures } from "@/providers/FeatureProvider";

export interface LoginProviderAvailability {
    openAthens: boolean;
    azure: boolean;
    registry: boolean;
    google: boolean;
    linkedIn: boolean;
    /** Whether any provider at all is currently available to sign in with. */
    any: boolean;
}

/**
 * Which sign-in providers are currently available.
 *
 * The same flags are enforced by the API, which refuses a login through a
 * disabled provider outright - this hook only keeps people from starting one
 * they cannot finish.
 */
export function useLoginProviders(): LoginProviderAvailability {
    const {
        isLoginDisabled,
        isSafePeopleRegistrySSOEnabled,
        isLoginGoogleEnabled,
        isLoginAzureEnabled,
        isLoginLinkedInEnabled,
        isLoginOpenAthensEnabled,
        isLoginRegistryEnabled,
    } = useFeatures();

    // A kill switch has to be switched *on* to bite. An absent flag - a short
    // features response, or a component rendered outside FeatureProvider -
    // leaves the provider available, because locking everyone out of sign-in
    // is a far worse failure than a provider staying up a moment too long.
    const loginUp = !isLoginDisabled;

    const providers = {
        openAthens: loginUp && isLoginOpenAthensEnabled !== false,
        azure: loginUp && isLoginAzureEnabled !== false,
        // Two separate conditions on purpose, and deliberately asymmetric: the
        // SSO flag is the release gate for the Registry integration and has to
        // be explicitly on, while the login flag is the operational switch the
        // API enforces and fails open like the rest.
        registry:
            loginUp &&
            isSafePeopleRegistrySSOEnabled === true &&
            isLoginRegistryEnabled !== false,
        google: loginUp && isLoginGoogleEnabled !== false,
        linkedIn: loginUp && isLoginLinkedInEnabled !== false,
    };

    return {
        ...providers,
        any: Object.values(providers).some(Boolean),
    };
}

export default useLoginProviders;
