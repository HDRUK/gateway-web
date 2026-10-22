"use client";

import { tokens } from "@hdruk/ui/theme";
import { Divider, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Typography from "@/components/Typography";

const TRANSLATION_PATH = "components.PartnerProvenance";

export interface PartnerProvenanceProps {
    /**
     * The owning partner's display name. The API sends it only for a context
     * that is not this deployment's own, so an absent name means "ours" and
     * nothing renders - the component never has to know which context is ours.
     */
    partnerName?: string | null;
}

/**
 * The "via Cancer Research UK" line under a search result's data custodian,
 * marking a record that came from another partner context. Sits below a divider
 * so it reads as a chain of custody rather than part of the custodian name.
 */
const PartnerProvenance = ({ partnerName }: PartnerProvenanceProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    if (!partnerName) return null;

    return (
        <Box sx={{ p: 0 }}>
            <Divider sx={{ my: 0.5 }} />
            <Tooltip
                describeChild
                title={t("tooltip", { partner: partnerName })}>
                <Typography
                    variant="caption"
                    component="p"
                    sx={{ color: tokens.text.secondary, m: 0 }}>
                    {/*
                     * The name is supplied by the <name> handler rather than as
                     * a {partner} value: the whole phrase stays in the message
                     * so a translation can reorder it, and it renders the same
                     * under the project's next-intl mock, which substitutes
                     * values in t() but not inside a rich tag.
                     */}
                    {t.rich("via", {
                        name: () => <strong>{partnerName}</strong>,
                    })}
                </Typography>
            </Tooltip>
        </Box>
    );
};

export default PartnerProvenance;
