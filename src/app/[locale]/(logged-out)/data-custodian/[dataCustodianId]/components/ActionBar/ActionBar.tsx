"use client";

import { Box, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { SearchCategory } from "@/interfaces/Search";
import { Team } from "@/interfaces/Team";
import BackButton from "@/components/BackButton";
import useAuth from "@/hooks/useAuth";
import useGeneralEnquiry from "@/hooks/useGeneralEnquiry";
import { SpeechBubbleIcon } from "@/consts/customIcons";
import { RouteName } from "@/consts/routeName";
import { ActionBarWrapper } from "./ActionBar.styles";

const TRANSLATION_PATH = "pages.dataCustodian.components.ActionBar";
interface ActionBarProps {
    team: Pick<Team, "id" | "name" | "member_of">;
}

const ActionBar = ({ team }: ActionBarProps) => {
    const router = useRouter();
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
        <ActionBarWrapper>
            <BackButton
                label={t("label")}
                style={{ margin: 0 }}
                onClick={() =>
                    router.push(
                        `/${RouteName.SEARCH}?type=${SearchCategory.DATA_PROVIDERS}`
                    )
                }
            />

            <Box sx={{ display: "flex", gap: 1, p: 0 }}>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleGeneralEnquiryClick}
                    startIcon={<SpeechBubbleIcon />}>
                    {t("enquire")}
                </Button>
            </Box>
        </ActionBarWrapper>
    );
};

export default ActionBar;
