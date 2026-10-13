import { flag } from "@vercel/flags/next";
import { createAPIFlagAdapter } from "./utils/gatewayFlagAdapter";

const adapter = createAPIFlagAdapter()<boolean, never>();

export const isSDEConciergeServiceEnquiryEnabled = flag({
    key: "SDEConciergeServiceEnquiry",
    adapter,
});

export const isAliasesEnabled = flag({
    key: "Aliases",
    adapter,
});

export const isNhsSdeApplicationsEnabled = flag({
    key: "NhsSdeApplicationsEnabled",
    adapter,
});

export const isWidgetsEnabled = flag({
    key: "Widgets",
    adapter,
});

export const isCohortDiscoveryServiceEnabled = flag({
    key: "CohortDiscoveryService",
    adapter,
});

export const isRQuestEnabled = flag({
    key: "RQuest",
    adapter,
});

export const isExternalSourcesEnabled = flag({
    key: "V2_SearchAggregation",
    adapter,
});

export const isTypesenseSearchEnabled = flag({
    key: "TypesenseSearch",
    adapter,
});

export const isCustodianDashboardEnabled = flag({
    key: "V3_CustodianDashboard",
    adapter,
});

export const isSafePeopleRegistrySSOEnabled = flag({
    key: "SafePeopleRegistrySSOEnabled",
    adapter,
});

export const isLoginDisabled = flag({
    key: "LoginDisabled",
    adapter,
});

// Per-provider sign-in kill switches. Each is enforced by the API as well -
// hiding a button here stops people starting a login through a provider that
// is failing, but only the API can refuse one already in flight.
export const isLoginGoogleEnabled = flag({
    key: "LoginGoogleEnabled",
    adapter,
});

export const isLoginAzureEnabled = flag({
    key: "LoginAzureEnabled",
    adapter,
});

export const isLoginLinkedInEnabled = flag({
    key: "LoginLinkedInEnabled",
    adapter,
});

export const isLoginOpenAthensEnabled = flag({
    key: "LoginOpenAthensEnabled",
    adapter,
});

export const isLoginRegistryEnabled = flag({
    key: "LoginRegistryEnabled",
    adapter,
});
