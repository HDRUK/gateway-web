import { V4Schema } from "@/interfaces/V4Schema";

export interface DuoCodeDetails {
    shortcode: string;
    label: string;
    description: string;
}

/**
 * GA4GH DUO code labels, keyed by code, from the HDRUK schema's DuoCodesEnum.
 * GWDM stores the codes but not their labels, so both dataset pages read them
 * from the HDRUK schema.
 */
export const toDuoCodeDetails = (
    schema: V4Schema | undefined
): Record<string, DuoCodeDetails> =>
    Object.fromEntries(
        (schema?.schema?.$defs?.DuoCodesEnum?.oneOf ?? []).map(option => [
            option.const,
            {
                shortcode: option.shortcode,
                label: option.title,
                description: option.description,
            },
        ])
    );
