import { flag } from "@vercel/flags/next";
import { createAPIFlagAdapter } from "./utils/gatewayFlagAdapter";

const adapter = createAPIFlagAdapter()<boolean, never>();

export const isSDEConciergeServiceEnquiryEnabled = flag({
    key: "SDEConciergeServiceEnquiry",
   adapter
});

export const isAliasesEnabled = flag({
    key: "Aliases",
    adapter
});

export const isNhsSdeApplicationsEnabled = flag({
    key: "NhsSdeApplicationsEnabled",
    adapter
});

export const isWidgetsEnabled = flag({
    key: "Widgets",
    adapter
});

export const isCohortDiscoveryServiceEnabled = flag({
    key: "CohortDiscoveryService",
    adapter: await gatewayAdapter(),
});

export const isRQuestEnabled = flag({
    key: "RQuest",
    adapter: await gatewayAdapter(),
});
