import { flag } from "@vercel/flags/next";
import { createGatewayFlagAdapter } from "./utils/gatewayFlagAdapter";

const gatewayAdapter = createGatewayFlagAdapter();

export const isSDEConciergeServiceEnquiryEnabled = flag({
    key: "SDEConciergeServiceEnquiry",
    adapter: await gatewayAdapter(),
});

export const isAliasesEnabled = flag({
    key: "Aliases",
    adapter: await gatewayAdapter(),
});

export const isNhsSdeApplicationsEnabled = flag({
    key: "NhsSdeApplicationsEnabled",
    adapter: await gatewayAdapter(),
});

export const isWidgetsEnabled = flag({
    key: "Widgets",
    adapter: await gatewayAdapter(),
});
