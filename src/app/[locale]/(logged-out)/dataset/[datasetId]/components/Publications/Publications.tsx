"use client";

import { useTranslations } from "next-intl";
import { Dataset } from "@/interfaces/Dataset";
import Box from "@/components/Box";
import Card from "@/components/Card";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import Link from "@/components/Link";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";

const TRANSLATION_PATH = "pages.dataset";

interface PublicationsProps {
    data: Dataset;
}

const Publications = ({ data }: PublicationsProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const publicationAboutThisDataset = data.publications.filter(
        pub => pub.dataset_versions[0].link_type === "ABOUT"
    );

    return (
        <Paper sx={{ borderRadius: 2, p: 2 }}>
            <Typography variant="h2"> {t("datasetPublications")} </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(1, 1fr)",
                    p: 0,
                    gap: 2,
                }}>
                {publicationAboutThisDataset.map(pub => (
                    <Card
                        variant="outlined"
                        sx={{ p: 1, borderRadius: 2, display: "grid" }}>
                        <Link
                            target="_blank"
                            href={pub?.url || pub?.paper_doi || ""}>
                            <EllipsisCharacterLimit
                                text={pub.paper_title}
                                characterLimit={100}
                            />
                        </Link>
                        <EllipsisCharacterLimit
                            text={pub.authors}
                            characterLimit={50}
                        />
                        <Typography style={{ fontWeight: "bold" }}>
                            {pub.journal_name}
                        </Typography>
                        <Typography>
                            Published - {pub.year_of_publication}
                        </Typography>
                    </Card>
                ))}
            </Box>
        </Paper>
    );
};

export default Publications;
