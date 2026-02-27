"use client";

import { Fragment } from "react";
import { Link } from "@mui/material";
import { useTranslations } from "next-intl";
import { DataProvider as DataCustodians } from "@/interfaces/DataProvider";
import AccordionSection from "@/components/AccordionSection";
import { RouteName } from "@/consts/routeName";
import { FilterValues } from "@/interfaces/Filter";
import { hasActiveFilters } from "@/utils/filters";

const TRANSLATION_PATH =
    "pages.dataCustodianNetwork.components.DataCustodianContent";

interface DataCustodianContentProps {
    dataCustodians: DataCustodians[];
    anchorIndex: number;
    filterValues: FilterValues;
}

export default function DataCustodianContent({
    dataCustodians,
    anchorIndex,
    filterValues,
}: DataCustodianContentProps) {
    const t = useTranslations(TRANSLATION_PATH);

    const activeCustodians = 
        dataCustodians.filter((dataCustodian) => 
            hasActiveFilters(filterValues) ? filterValues[dataCustodian.name] : true);

    return (
        <AccordionSection
            id={`anchor${anchorIndex}`}
            disabled={!activeCustodians.length}
            heading={t("heading", {
                length: activeCustodians.length,
            })}
            defaultExpanded={activeCustodians.length > 0}
            contents={activeCustodians.map(
                ({
                    name,
                    id,
                    datasets_count,
                    publications_count,
                    tools_count,
                    collections_count,
                    durs_count,
                }) => (
                    <Fragment key={`data-custodian-${id}`}>
                        <Link
                            href={`/${RouteName.DATA_CUSTODIANS_ITEM}/${id}`}
                            style={{ textDecoration: "none" }}>
                            {name}
                        </Link>
                        <table>
                            <tbody>
                                <tr>
                                    <td>{`${t("datasets", {
                                        length: datasets_count,
                                    })}`}</td>
                                    <td>{`${t("datause", {
                                        length: durs_count,
                                    })}`}</td>
                                </tr>
                                <tr>
                                    <td>{`${t("tools", {
                                        length: tools_count,
                                    })}`}</td>
                                    <td>{`${t("publications", {
                                        length: publications_count,
                                    })}`}</td>
                                </tr>
                                <tr>
                                    <td>{`${t("collections", {
                                        length: collections_count,
                                    })}`}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Fragment>
                )
            )}
        />
    );
}
