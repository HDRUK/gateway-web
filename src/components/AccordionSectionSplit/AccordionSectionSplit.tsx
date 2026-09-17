"use client";

import { ReactElement } from "react";
import { Typography } from "@mui/material";
import Accordion, { AccordionProps } from "@/components/Accordion/Accordion";
import {
    Pane,
    PaneCount,
    PaneHeading,
    PaneTitle,
    ScrollArea,
    SplitCard,
    SplitWrapper,
} from "./AccordionSectionSplit.styles";

export interface AccordionSectionSplitProps
    extends Omit<AccordionProps, "contents"> {
    ownedHeading: string;
    ownedCount: number;
    associatedHeading?: string;
    associatedCount?: number;
    ownedContents: ReactElement[];
    associatedContents?: ReactElement[];
    cardHeight?: number;
    visibleRows?: number;
    disableCardWrapper?: boolean;
}

const DEFAULT_CARD_HEIGHT = 140;
const DEFAULT_VISIBLE_ROWS = 3;

export default function AccordionSectionSplit({
    heading,
    ownedHeading,
    ownedCount,
    associatedHeading = "",
    associatedCount = 0,
    ownedContents,
    associatedContents = [],
    cardHeight = DEFAULT_CARD_HEIGHT,
    visibleRows = DEFAULT_VISIBLE_ROWS,
    disableCardWrapper = false,
    ...restProps
}: AccordionSectionSplitProps) {
    const panes = [
        { heading: ownedHeading, count: ownedCount, contents: ownedContents },
        {
            heading: associatedHeading,
            count: associatedCount,
            contents: associatedContents,
        },
    ].filter(pane => pane.contents.length > 0);

    return (
        <Accordion
            {...restProps}
            variant="plain"
            noIndent
            elevation={0}
            sx={{ borderBottom: 1, borderColor: "greyCustom.light" }}
            headingComponent="h2"
            heading={
                <Typography
                    variant="h2"
                    component="span"
                    color="primary"
                    sx={{ fontWeight: 400, mb: 0 }}>
                    {heading}
                </Typography>
            }
            contents={
                <SplitWrapper columnCount={panes.length}>
                    {panes.map(pane => (
                        <Pane key={pane.heading}>
                            <PaneHeading>
                                <PaneTitle variant="articleLead">
                                    {pane.heading}
                                </PaneTitle>
                                <PaneCount variant="caption">
                                    ({pane.count})
                                </PaneCount>
                            </PaneHeading>
                            <ScrollArea
                                cardHeight={cardHeight}
                                mediaCards={disableCardWrapper}
                                visibleRows={visibleRows}>
                                {disableCardWrapper
                                    ? pane.contents
                                    : pane.contents.map(content => (
                                          <SplitCard key={content.key}>
                                              {content}
                                          </SplitCard>
                                      ))}
                            </ScrollArea>
                        </Pane>
                    ))}
                </SplitWrapper>
            }
        />
    );
}
