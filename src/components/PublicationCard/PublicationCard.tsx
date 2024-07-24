"use client";

import { Publication } from "@/interfaces/Publication";
import { IconType } from "@/interfaces/Ui";
import Box from "@/components/Box";
import KeyValueList from "@/components/KeyValueList";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import { formatDate } from "@/utils/date";
import CardActions from "../CardActions";

interface PublicationCardProps {
    publication: Publication;
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
    }[];
}

const PublicationCard = ({ publication, actions }: PublicationCardProps) => {
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
                    gridTemplateColumns: "repeat(1, 1fr 50px)",
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

                <Box sx={{ p: 0, borderLeft: `solid 1px ${colors.grey600}` }}>
                    <CardActions actions={actions} id={publication.id} status />
                </Box>
            </Box>
        </Paper>
    );
};

export default PublicationCard;
