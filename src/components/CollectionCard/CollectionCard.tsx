import { useTranslations } from "next-intl";
import { Collection } from "@/interfaces/Collection";
import { IconType } from "@/interfaces/Ui";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import theme, { colors } from "@/config/theme";
import { formatDate } from "@/utils/date";
import CardActions from "../CardActions";
import KeyValueList from "../KeyValueList";

interface CollectionCardProps {
    collection: Collection;
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
    }[];
}

const TRANSLATION_PATH = "components.CollectionCard";

const CollectionCard = ({ collection, actions }: CollectionCardProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const {
        name,
        users,
        datasets,
        tools,
        image_link,
        publications,
        updated_at,
        dur
    } = collection || {};

    const hasImage = !!image_link;

    return (
        <Paper data-testid="collection-card" sx={{ mb: 2 }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(1, 1fr 50px)",
                    p: 0,
                }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            mobile: "repeat(1, 1fr)",
                            tablet: "repeat(1, 1fr 4fr)",
                        },
                        gap: 2,
                        p: 2,
                    }}>
                    <Box
                        sx={{
                            p: 2,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            color: colors.white,
                            backgroundImage: hasImage && `url(${image_link})`,
                            background:
                                !hasImage &&
                                `linear-gradient(to right, ${theme.palette.secondary.main},${theme.palette.primary.main})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}>
                        {!hasImage && (
                            <Typography variant="h3" sx={{ fontSize: 20 }}>
                                {name}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ p: 0, fontSize: 13 }}>
                        <Typography variant="h3" sx={{ mb: 2, fontSize: 16 }}>
                            {name}
                        </Typography>
                        <KeyValueList
                            rows={[
                                {
                                    key: t("users"),
                                    value:
                                        users?.map(u => u.name).join(", ") ||
                                        "-",
                                },
                                {
                                    key: t("entities"),
                                    value: t("entitiesCounts", {
                                        nDatasets: datasets?.length || 0,
                                        nTools: tools?.length || 0,
                                        nPublications:
                                            publications?.length || 0,
                                        nDur:
                                            dur?.length || 0,
                                    }),
                                },
                                {
                                    key: "Last activity",
                                    value: formatDate(
                                        updated_at,
                                        "DD MMMM YYYY HH:mm"
                                    ),
                                },
                            ]}
                        />
                    </Box>
                </Box>
                <Box sx={{ p: 0, borderLeft: `solid 1px ${colors.grey600}` }}>
                    <CardActions
                        actions={actions}
                        id={collection.id}
                        status={collection.status}
                    />
                </Box>
            </Box>
        </Paper>
    );
};

export default CollectionCard;
