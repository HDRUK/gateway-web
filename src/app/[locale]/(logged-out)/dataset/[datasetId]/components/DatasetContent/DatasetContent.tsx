"use client";

import { InView } from "react-intersection-observer";
import { createColumnHelper } from "@tanstack/react-table";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { VersionItem } from "@/interfaces/Dataset";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Paper from "@/components/Paper";
import Table from "@/components/Table";
import Typography from "@/components/Typography";
import {
    DatasetSection,
    Observation,
    observationTableColumns,
} from "../../config";
import { ObservationTableWrapper } from "./DatasetContent.styles";

const TRANSLATION_PATH = "pages.dataset";
// const DATE_FORMAT = "DD/MM/YYYY";

const columnHelper = createColumnHelper<Observation>();

const getColumns = () =>
    observationTableColumns.map(column =>
        columnHelper.display({
            id: column.header,
            cell: ({ row: { original } }) => (
                <p>{get(original, column.path)}</p>
            ),
            header: () => <span>{column.header}</span>,
        })
    );

const DatasetContent = ({
    data,
    populatedSections,
}: {
    data: VersionItem;
    populatedSections: DatasetSection[];
}) => {
    const t = useTranslations(TRANSLATION_PATH);
    const router = useRouter();
    const path = usePathname();

    console.log(data, populatedSections);

    const renderObservationsTable = (rows?: Observation[]) => (
        <ObservationTableWrapper>
            <Table<Observation> columns={getColumns()} rows={rows || []} />
        </ObservationTableWrapper>
    );

    // const renderDatasetField = (type: FieldType, value: string) => {
    //     switch (type) {
    //         case FieldType.DATE: {
    //             return (
    //                 <Typography>{formatDate(value, DATE_FORMAT)}</Typography>
    //             );
    //         }
    //         case FieldType.TAG: {
    //             const tagList = splitStringList(value);

    //             return (
    //                 <DatasetFieldWrapper>
    //                     {tagList.map(tag => (
    //                         <DatasetFieldItem
    //                             color="success"
    //                             size="small"
    //                             label={tag}
    //                             onClick={() =>
    //                                 router.push(
    //                                     `/${RouteName.SEARCH}?type=${
    //                                         SearchCategory.DATASETS
    //                                     }&query=${encodeURIComponent(tag)}`
    //                                 )
    //                             }
    //                             key={tag}
    //                         />
    //                     ))}
    //                 </DatasetFieldWrapper>
    //             );
    //         }
    //         case FieldType.LINK:
    //             return (
    //                 <Link href={value} target="_blank">
    //                     {value}
    //                 </Link>
    //             );
    //         case FieldType.LIST: {
    //             const list = splitStringList(value);
    //             return list.map(item => (
    //                 <Typography key={item}>{item}</Typography>
    //             ));
    //         }
    //         default:
    //             return <Typography>{value}</Typography>;
    //     }
    // };

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
                    gridColumn: { tablet: "span 5", laptop: "span 3" },
                    p: 0,
                }}>
                <Paper sx={{ borderRadius: 2, p: 2 }}>
                    {populatedSections.map((section, index) => (
                        <InView
                            key={`${section.sectionName}_inview`}
                            id={`anchor${index + 1}`}
                            threshold={1}
                            as="div"
                            onChange={inView => {
                                if (inView && path) {
                                    router.replace(
                                        `${path}?section=${index + 1}`,
                                        { scroll: false }
                                    );
                                }
                            }}>
                            <Box
                                key={`${section.sectionName}_wrap`}
                                id={`anchor${index + 1}`}
                                sx={{
                                    "&:not(:last-of-type)": {
                                        borderBottom: 1,
                                        borderColor: "greyCustom.light",
                                    },
                                    pl: 0,
                                    pr: 0,
                                }}>
                                <Typography variant="h2">
                                    {section.sectionName}
                                </Typography>

                                {section.sectionName === "Observations"
                                    ? renderObservationsTable(
                                          get(
                                              data,
                                              "metadata.metadata.observations"
                                          )
                                      )
                                    : section.fields.map(field => {
                                          const value = get(data, field.path);

                                          if (!value) {
                                              return null;
                                          }

                                          //   if (!field.label) {
                                          //       return (
                                          //           <Box
                                          //               sx={{
                                          //                   p: 0,
                                          //                   pb: 2,
                                          //               }}
                                          //               key={value}>
                                          //               {renderDatasetField(
                                          //                   field.type,
                                          //                   value
                                          //               )}
                                          //           </Box>
                                          //       );
                                          //   }

                                          return (
                                              <BoxContainer
                                                  sx={{
                                                      gridTemplateColumns: {
                                                          desktop:
                                                              "repeat(3, 1fr)",
                                                      },
                                                      gap: 1,
                                                      "&:not(:last-of-type)": {
                                                          mb: 2,
                                                      },
                                                  }}
                                                  key={field.label}>
                                                  <Box
                                                      sx={{
                                                          gridColumn: {
                                                              desktop: "span 1",
                                                          },
                                                          p: 0,
                                                      }}>
                                                      {field.label}
                                                  </Box>
                                                  {/* <Box
                                                      sx={{
                                                          gridColumn: {
                                                              desktop: "span 2",
                                                          },
                                                          p: 0,
                                                      }}>
                                                      {renderDatasetField(
                                                          field.type,
                                                          value
                                                      )}
                                                  </Box> */}
                                              </BoxContainer>
                                          );
                                      })}
                            </Box>
                        </InView>
                    ))}
                </Paper>
            </Box>
            <Box
                sx={{
                    gridColumn: { tablet: "span 5", laptop: "span 2" },
                    p: 0,
                }}>
                <Paper sx={{ borderRadius: 2, p: 2 }}>
                    {t("datasetPublications")}
                </Paper>
            </Box>
        </BoxContainer>
    );
};

export default DatasetContent;
