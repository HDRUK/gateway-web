import { useTranslations } from "next-intl";
import { DarTemplate } from "@/interfaces/DataAccessRequest";
import { IconType } from "@/interfaces/Ui";
import Box from "@/components/Box";
import CardActions from "@/components/CardActions";
import KeyValueList from "@/components/KeyValueList";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import Paper from "@/components/Paper";
import ShowingXofX from "@/components/ShowingXofX";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import { formatDate } from "@/utils/date";

interface TemplateListProps {
    list?: DarTemplate[];
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
    }[];
    lastPage?: number;
    from?: number;
    to?: number;
    total?: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    isLoading: boolean;
}

const TemplateList = ({
    actions,
    list,
    lastPage,
    from,
    to,
    total,
    currentPage,
    setCurrentPage,
    isLoading,
}: TemplateListProps) => {
    const t = useTranslations(`pages.account.team.dar.template.list`);

    return (
        <Box sx={{ p: 0 }}>
            <Box
                sx={{
                    p: 0,
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                <ShowingXofX from={from} to={to} total={total} />
            </Box>

            {isLoading && <Loading />}

            {!isLoading &&
                (list || []).map((template, index) => (
                    <Paper sx={{ mb: 2 }}>
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
                                        tablet: "repeat(1, 2fr 1fr)",
                                    },
                                    gap: 2,
                                    pb: 1,
                                }}>
                                <Box sx={{ p: 0, fontSize: 13 }}>
                                    <Typography
                                        variant="h3"
                                        sx={{ mb: 2, fontSize: 16 }}>
                                        {t("cardTitle", {
                                            createdAt: formatDate(
                                                template.created_at,
                                                "DD MMMM YYYY"
                                            ),
                                        })}
                                    </Typography>
                                    <KeyValueList
                                        rows={[
                                            {
                                                key: t("published"),
                                                value: template.published
                                                    ? "Yes"
                                                    : "No",
                                            },
                                            {
                                                key: t("numberOfQuestions"),
                                                value: template.questions
                                                    .length,
                                            },
                                            {
                                                key: t("lastActivity"),
                                                value: formatDate(
                                                    template.updated_at,
                                                    "DD MMMM YYYY HH:mm"
                                                ),
                                            },
                                        ]}
                                    />
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    p: 0,
                                    borderLeft: `solid 1px ${colors.grey600}`,
                                }}>
                                <CardActions
                                    actions={actions}
                                    id={template.id}
                                />
                            </Box>
                        </Box>
                    </Paper>
                ))}

            {list?.length === 0 && (
                <Paper sx={{ p: 2, mb: 2 }}>{t("noTemplates")}</Paper>
            )}

            <Pagination
                isLoading={isLoading}
                page={currentPage}
                count={lastPage}
                onChange={(e: React.ChangeEvent<unknown>, page: number) =>
                    setCurrentPage(page)
                }
            />
        </Box>
    );
};

export default TemplateList;
