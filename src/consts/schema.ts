export const SCHEMA_NAME = process.env.NEXT_PUBLIC_SCHEMA_NAME || "HDRUK";
export const SCHEMA_VERSION =
    process.env.NEXT_PUBLIC_SCHEMA_VERSION || "4.1.0";
export const SCHEMA_BRANCH = process.env.NEXT_PUBLIC_SCHEMA_BRANCH || "master";

/**
 * The Gateway's internal storage model. Requesting it as the output schema on a
 * dataset read means "no translation - return the stored GWDM"; omitting it
 * leaves the API applying the caller's partner default, which external partners
 * depend on.
 */
export const GWDM_SCHEMA_NAME = process.env.NEXT_PUBLIC_GWDM_NAME || "GWDM";
