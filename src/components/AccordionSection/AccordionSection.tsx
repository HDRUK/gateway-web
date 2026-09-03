import { ReactNode, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Accordion, { AccordionProps } from "@/components/Accordion/Accordion";
import { PaneTitle } from "@/components/AccordionSectionSplit/AccordionSectionSplit.styles";
import BoxContainer from "@/components/BoxContainer";
import { ShowMoreButton } from "@/components/ShowMore";
import AccordionCard from "./AccordionCard";

export interface AccordionSectionProps
    extends Omit<AccordionProps, "contents"> {
    contents: ReactNode[];
    limitRows?: number;
    title: string;
}

const TRANSLATION_PATH = "components.ShowMore";

export default function AccordionSection({
    contents,
    heading,
    title,
    limitRows = 6,
    ...restProps
}: AccordionSectionProps) {
    const limitItems = contents.slice(0, limitRows);
    const remainingItems = contents.slice(limitRows, contents.length);
    const [showAll, setShowAll] = useState(false);

    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Accordion
            {...restProps}
            variant="plain"
            noIndent
            elevation={0}
            headingComponent="h2"
            heading={
                <Typography
                    variant="h2"
                    component="span"
                    color="primary"
                    sx={{ fontWeight: 400, mb: 0 }}>
                    {title}
                </Typography>
            }
            contents={
                <>
                    <PaneTitle variant="articleLead" sx={{ mb: 2 }}>
                        {heading}
                    </PaneTitle>
                    <BoxContainer
                        sx={{
                            gridTemplateColumns: {
                                xs: "repeat(1, 1fr)",
                                lg: "repeat(3, 1fr)",
                            },
                            gap: 2,
                        }}>
                        {limitItems.map(content => (
                            <AccordionCard key={content.key}>
                                {content}
                            </AccordionCard>
                        ))}
                        {showAll &&
                            remainingItems.map(content => (
                                <AccordionCard key={content.key}>
                                    {content}
                                </AccordionCard>
                            ))}
                    </BoxContainer>
                    {!!remainingItems.length && (
                        <Box sx={{ mt: 2 }}>
                            <ShowMoreButton
                                onClick={() => setShowAll(showAll => !showAll)}
                                open={showAll}>
                                {showAll ? t("showLess") : t("showMore")}
                            </ShowMoreButton>
                        </Box>
                    )}
                </>
            }
        />
    );
}
