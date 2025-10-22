"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Widget } from "@/interfaces/Widget";
import Box from "@/components/Box";
import CardActions from "@/components/CardActions";
import KeyValueList from "@/components/KeyValueList";
import Link from "@/components/Link";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import useDelete from "@/hooks/useDelete";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import { DarEditIcon, DeleteIcon, EyeIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { formatDate } from "@/utils/date";

interface WidgetListProps {
    permissions: { [key: string]: boolean };
    teamId: string;
}

const TRANSLATION_PATH = `pages.account.team.widgets`;

const WidgetList = ({ permissions, teamId }: WidgetListProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const params = useParams<{ teamId: string }>();

    const baseWidgetUrl = `${apis.teamsV1Url}/${teamId}/widgets`;

    const {
        data: widgetList,
        isLoading,
        mutate: mutateWidgets,
    } = useGet<Widget[]>(baseWidgetUrl, {
        keepPreviousData: false,
        withPagination: false,
    });

    const deleteWidget = useDelete(baseWidgetUrl, { itemName: t("widget") });

    const showDeleteButton = permissions["widgets.delete"];

    const actions = [
        ...(permissions["widgets.update"]
            ? [
                  {
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params.teamId}/${RouteName.INTEGRATIONS}/${RouteName.WIDGETS}`,
                      icon: DarEditIcon,
                      label: t("actions.edit.label"),
                  },
              ]
            : []),
        ...(permissions["widgets.update"]
            ? [
                  {
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params.teamId}/${RouteName.INTEGRATIONS}/${RouteName.WIDGETS}`,
                      icon: EyeIcon,
                      label: t("actions.preview.label"),
                  },
              ]
            : []),
        ...(showDeleteButton
            ? [
                  {
                      action: async (id: number) => {
                          await deleteWidget(id);
                          mutateWidgets();
                      },
                      icon: DeleteIcon,
                      label: t("actions.delete.label"),
                  },
              ]
            : []),
    ];

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                flexGrow: 1,
                gap: 2,
                p: 0,
                mb: 2,
            }}>
            {isLoading && (
                <Box
                    sx={{
                        display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                        width: "100%",
                    }}>
                    <Loading />
                </Box>
            )}
            {widgetList?.map(widget => (
                <Paper
                    sx={{ m: 0, flexGrow: 1, width: "100%" }}
                    key={widget.id}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(1, 1fr 50px)",
                            p: 0,
                        }}>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(1, 1fr)",
                                gap: 2,
                                pb: 1,
                            }}>
                            <>
                                <Link
                                    href={`${RouteName.WIDGETS}/${widget.id}`}
                                    fontSize={16}>
                                    {widget.widget_name}
                                </Link>

                                <KeyValueList
                                    rows={[
                                        {
                                            key: t("search"),
                                            value: widget.include_search_bar
                                                ? "Yes"
                                                : "No",
                                        },
                                        {
                                            key: t("dimensions"),
                                            value: `${widget.size_width} x ${widget.size_height} ${widget.unit}`,
                                        },
                                        {
                                            key: t("dateUpdated"),
                                            value: formatDate(
                                                widget.updated_at,
                                                "DD MMMM YYYY HH:mm"
                                            ),
                                        },
                                    ]}
                                />
                            </>
                        </Box>

                        <Box
                            sx={{
                                p: 0,
                                borderLeft: `solid 1px ${colors.grey600}`,
                                my: 2,
                            }}>
                            <CardActions actions={actions} id={widget.id} />
                        </Box>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default WidgetList;
