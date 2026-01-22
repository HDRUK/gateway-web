"use client";

import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { PageTemplatePromo } from "@/interfaces/Cms";
import { SearchCategory } from "@/interfaces/Search";
import { Team } from "@/interfaces/Team";
import CohortDiscoveryButton from "@/components/CohortDiscoveryButton";
import HeaderActionBar from "@/components/HeaderActionBar";
import useAuth from "@/hooks/useAuth";
import useGeneralEnquiry from "@/hooks/useGeneralEnquiry";
import { SpeechBubbleIcon } from "@/consts/customIcons";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH = "pages.dataCustodian.components.ActionBar";
interface ActionBarProps {
    team: Pick<Team, "id" | "name" | "member_of">;
    cohortDiscovery: PageTemplatePromo | null;
    cohortDiscoveryEnabled: boolean;
}

const ActionBar = ({
    team,
    cohortDiscovery,
    cohortDiscoveryEnabled,
}: ActionBarProps) => {
    const path = usePathname();
    const { isLoggedIn } = useAuth();
    const showGeneralEnquiry = useGeneralEnquiry();

    const t = useTranslations(TRANSLATION_PATH);

    const result = {
        // this is a temp hack
        // these components were originally built for SearchDatasetResult.......
        // -- which is some weird combo of elastic and GWDM
        // - this might cause problems in the future too as our metadata is HDRUK not GWDM
        // - have to have something working for now....
        _id: null,
        team,
    };

    const handleGeneralEnquiryClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event?.stopPropagation();
        showGeneralEnquiry({ dataset: result, isLoggedIn, redirectPath: path });
    };

    return (
        <HeaderActionBar
            backButtonText={t("backLabel")}
            backButtonHref={`/${RouteName.SEARCH}?type=${SearchCategory.DATA_CUSTODIANS}`}
            additionalContent={
                <>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleGeneralEnquiryClick}
                        startIcon={<SpeechBubbleIcon />}>
                        {t("enquire")}
                    </Button>
                    {cohortDiscovery?.template?.promofields?.ctaLink && (
                        <CohortDiscoveryButton
                            ctaLink={
                                cohortDiscovery?.template?.promofields?.ctaLink
                            }
                            disabledOuter={!cohortDiscoveryEnabled}
                            tooltipOverride={
                                cohortDiscoveryEnabled
                                    ? ""
                                    : t("cohortDiscoveryDisabled")
                            }
                            showDatasetExplanatoryTooltip
                        />
                    )}
                </>
            }
        />
    );
};

export default ActionBar;
