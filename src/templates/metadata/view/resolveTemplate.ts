import { DEFAULT_VERSION, GeneratedTemplate } from "./meta";

/** The Gateway's own partner context, and the fallback for every other. */
export const DEFAULT_PARTNER = "HDRUK";

export interface TemplateQuery {
    partner?: string;
    gwdmVersion?: string | null;
}

/**
 * Most specific first:
 *
 *   overrides/{partner}/{gwdmVersion}  ->  overrides/{partner}/default
 *   -> overrides/HDRUK/{gwdmVersion}   ->  overrides/HDRUK/default
 *
 * Every dataset is rendered from native GWDM, so a partner with no templates
 * of its own still renders correctly from the HDRUK default - a partner
 * template only changes arrangement, never whether a field can be shown.
 */
export const resolveTemplate = (
    entries: GeneratedTemplate[],
    { partner, gwdmVersion }: TemplateQuery
): GeneratedTemplate => {
    const find = (p: string, v: string) =>
        entries.find(
            entry =>
                entry.partner.toUpperCase() === p.toUpperCase() &&
                entry.version === v
        );

    const partners = [partner, DEFAULT_PARTNER].filter((p): p is string => !!p);

    const candidates = partners.flatMap(p => [
        ...(gwdmVersion ? [[p, gwdmVersion]] : []),
        [p, DEFAULT_VERSION],
    ]);

    for (const [p, v] of candidates) {
        const match = find(p, v);
        if (match) return match;
    }

    throw new Error(
        `No metadata template found - overrides/${DEFAULT_PARTNER}/${DEFAULT_VERSION}/index.mdx must exist.`
    );
};
