"use client";

import { InView } from "react-intersection-observer";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Tag } from "@/interfaces/Tag";
import { Tool } from "@/interfaces/Tool";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import Paper from "@/components/Paper";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";
import { formatDate } from "@/utils/date";
import { ToolSection, FieldType } from "../../config";
import { ToolFieldWrapper } from "./ToolContent.styles";

const TRANSLATION_PATH = "pages.tool";
const DATE_FORMAT = "DD/MM/YYYY";
const TOOLTIP_SUFFIX = "Tooltip";

const ToolContent = ({
    data,
    populatedSections,
}: {
    data: Tool;
    populatedSections: ToolSection[];
}) => {
    const t = useTranslations(TRANSLATION_PATH);
    const router = useRouter();
    const path = usePathname();

    const renderToolField = (
        path: string,
        type: FieldType,
        value: string | string[]
    ) => {
        const val = value as string;

        switch (type) {
            case FieldType.DATE: {
                return <Typography>{formatDate(val, DATE_FORMAT)}</Typography>;
            }
            case FieldType.TAG: {
                return (
                    <ToolFieldWrapper>
                        {(value as unknown as Tag[])?.map(tag => (
                            <EllipsisCharacterLimit
                                key={tag.id}
                                text={tag.type}
                                characterLimit={50}
                            />
                        ))}
                    </ToolFieldWrapper>
                );
            }
            default:
                return <Typography>{val}</Typography>;
        }
    };

    return (
        <BoxContainer
            sx={{
                gridTemplateColumns: {
                    tablet: "repeat(5, 1fr)",
                },
                gap: {
                    mobile: 1,
                    tablet: 2,
                },
                p: 0,
            }}>
            <Box
                sx={{
                    gridColumn: { tablet: "span 5", laptop: "span 5" },
                    p: 0,
                }}>
                <Paper sx={{ borderRadius: 2, p: 2 }}>
                    {populatedSections.map((section, index) => (
                        <InView
                            key={`${section.sectionName}_inview`}
                            id={`anchor${index + 2}`}
                            threshold={1}
                            as="div"
                            onChange={inView => {
                                if (inView && path) {
                                    router.replace(
                                        `${path}?section=${index + 2}`,
                                        { scroll: false }
                                    );
                                }
                            }}>
                            <Box
                                key={`${section.sectionName}_wrap`}
                                id={`anchor${index + 2}`}
                                sx={{
                                    "&:not(:last-of-type)": {
                                        borderBottom: 1,
                                        borderColor: "greyCustom.light",
                                    },
                                    pl: 0,
                                    pr: 0,
                                }}>
                                <Typography variant="h2">
                                    {t(section.sectionName)}
                                </Typography>

                                {section.fields.map(field => {
                                    const { label } = field;

                                    const value =
                                        get(data, field.path) ||
                                        t("notAvailable");

                                    if (!label) {
                                        return (
                                            <Box
                                                sx={{
                                                    p: 0,
                                                    pb: 2,
                                                }}
                                                key={value}>
                                                {renderToolField(
                                                    field.path,
                                                    field.type,
                                                    value
                                                )}
                                            </Box>
                                        );
                                    }

                                    return (
                                        <BoxContainer
                                            sx={{
                                                gridTemplateColumns: {
                                                    desktop: "repeat(3, 1fr)",
                                                },
                                                gap: 1,
                                                "&:not(:last-of-type)": {
                                                    mb: 2,
                                                },
                                            }}
                                            key={field.path}>
                                            <Box
                                                sx={{
                                                    gridColumn: {
                                                        desktop: "span 1",
                                                    },
                                                    p: 0,
                                                }}>
                                                {!field.hideTooltip ? (
                                                    <TooltipIcon
                                                        content={t(
                                                            `${label}${TOOLTIP_SUFFIX}`
                                                        )}
                                                        label={t(label)}
                                                    />
                                                ) : (
                                                    t(label)
                                                )}
                                            </Box>
                                            <Box
                                                sx={{
                                                    gridColumn: {
                                                        desktop: "span 2",
                                                    },
                                                    p: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}>
                                                {renderToolField(
                                                    field.path,
                                                    field.type,
                                                    value
                                                )}
                                            </Box>
                                        </BoxContainer>
                                    );
                                })}
                            </Box>
                        </InView>
                    ))}
                </Paper>
            </Box>
        </BoxContainer>
    );
};

export default ToolContent;
