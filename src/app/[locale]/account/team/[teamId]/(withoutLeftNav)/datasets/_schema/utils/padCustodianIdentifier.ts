import { cloneDeep, get, set } from "lodash";

const CUSTODIAN_IDENTIFIER = "summary.dataCustodian.identifier";

export const padCustodianIdentifier = (
    document: Record<string, unknown>
): Record<string, unknown> => {
    const identifier = get(document, CUSTODIAN_IDENTIFIER);
    if (typeof identifier !== "string" || identifier.length !== 1) {
        return document;
    }
    return set(
        cloneDeep(document),
        CUSTODIAN_IDENTIFIER,
        identifier.padStart(2, "0")
    );
};
