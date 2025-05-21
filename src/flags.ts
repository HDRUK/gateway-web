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
