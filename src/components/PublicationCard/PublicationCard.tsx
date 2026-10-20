"use client";

import { tokens } from "@hdruk/ui/theme";
import { Publication } from "@/interfaces/Publication";
import { IconType } from "@/interfaces/Ui";
import Box from "@/components/Box";
import KeyValueList from "@/components/KeyValueList";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { DataStatus } from "@/consts/application";
import { formatDate } from "@/utils/date";
import CardActions from "../CardActions";
import StatusMenu from "../StatusMenu";

interface PublicationCardProps {
    onStatusChange?: (id: number, status: DataStatus) => void;
    disabledStatusOptions?: DataStatus[];
    publication: Publication;
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
    }[];
}

const PublicationCard = ({
    publication,
    actions,
    onStatusChange,
    disabledStatusOptions,
}: PublicationCardProps) => {
    const {
        updated_at,
        authors,
        journal_name,
        year_of_publication,
        paper_title,
    } = publication;

    return (
        <Paper data-testid="publication-card" sx={{ mb: 2 }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: onStatusChange
                        ? "1fr auto 50px"
                        : "repeat(1, 1fr 50px)",
                    p: 0,
                }}>
                <Box sx={{ p: 2, fontSize: 13 }}>
                    <Typography variant="h3" sx={{ mb: 2, fontSize: 16 }}>
                        {paper_title}
                    </Typography>
                    <KeyValueList
                        rows={[
                            {
                                key: "Authors",
                                value: authors,
                            },
                            {
                                key: "Journal Name",
                                value: journal_name,
                            },
                            {
                                key: "Last activity",
                                value: formatDate(
                                    updated_at,
                                    "DD MMMM YYYY HH:mm"
                                ),
                            },
                            {
                                key: "Publication year",
                                value: year_of_publication,
                            },
                        ]}
                    />
                </Box>

                {onStatusChange && (
                    <Box>
                        <StatusMenu
                            status={publication.status as DataStatus}
                            onChange={status =>
                                onStatusChange(publication.id, status)
                            }
                            disabledOptions={disabledStatusOptions}
                        />
                    </Box>
                )}
                <Box
                    sx={{
                        p: 0,
                        borderLeft: `solid 1px ${tokens.status.faded}`,
                    }}>
                    <CardActions actions={actions} id={publication.id} />
                </Box>
            </Box>
        </Paper>
    );
};

export default PublicationCard;
