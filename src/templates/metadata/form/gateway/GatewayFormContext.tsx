"use client";

import { createContext, useContext } from "react";
import type { JSONSchemaDocument } from "@hdruk/gwdm-view";
import type { OnboardingSchema } from "@hdruk/metadata-onboard";
import { OptionsType } from "@/components/Autocomplete/Autocomplete";

export interface GatewayFormContextValue extends OnboardingSchema {
    schema: JSONSchemaDocument;
    teamId: string;
    defaultTeam?: OptionsType;
    introAside?: HTMLElement | null;
}

export const GatewayFormContext = createContext<
    GatewayFormContextValue | undefined
>(undefined);

export const useGatewayForm = (): GatewayFormContextValue => {
    const context = useContext(GatewayFormContext);
    if (!context) {
        throw new Error("Gateway form tags need <GatewayFormContext>.");
    }
    return context;
};
