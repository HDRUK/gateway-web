import { cloneDeep, get, mergeWith, omit, set } from "lodash";
import { OnboardingForm } from "@/interfaces/OnboardingForm";

const CUSTODIAN_LOGO = "summary.dataCustodian.logo";

/**
 * The form's starting values: the team's defaults with the saved metadata
 * layered over them. Saved lists replace default lists rather than merging
 * item by item, and `omitPaths` drops saved fields (e.g. on duplicate).
 */
export const hydrateFormValues = (
    form: Pick<OnboardingForm, "defaultValues" | "metadata">,
    omitPaths?: string[]
): Record<string, unknown> => {
    const saved = omitPaths
        ? omit(form.metadata ?? {}, omitPaths)
        : form.metadata;

    const defaults = cloneDeep(form.defaultValues);
    const logo = get(defaults, CUSTODIAN_LOGO);
    if (typeof logo === "string" && logo) {
        set(defaults, CUSTODIAN_LOGO, encodeURI(logo));
    }

    return mergeWith({}, defaults, saved, (_: unknown, value: unknown) =>
        Array.isArray(value) ? value : undefined
    );
};
