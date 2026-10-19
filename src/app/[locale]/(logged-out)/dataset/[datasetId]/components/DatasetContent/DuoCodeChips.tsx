"use client";

import { Tooltip } from "@mui/material";
import { isArray } from "lodash";
import { useTranslations } from "next-intl";
import Link from "@/components/Link";
import Typography from "@/components/Typography";
import { splitStringList } from "@/utils/dataset";
import { DuoCodeDetails } from "../../_gwdm/lib/duoCodeDetails";
import { DatasetFieldItem, DatasetFieldWrapper } from "./DatasetContent.styles";

const TRANSLATION_PATH = "common";

// GA4GH's OLS4 instance requires the term's OBO purl, percent-encoded twice
// (once for the purl itself, once more because OLS4 treats the whole path
// segment as needing re-encoding) - e.g. DUO:0000042 -> DUO_0000042 ->
// http://purl.obolibrary.org/obo/DUO_0000042 -> doubly-encoded path segment.
const getOlsLinkForDuoCode = (code: string): string => {
    const purl = `http://purl.obolibrary.org/obo/${code.replace(":", "_")}`;
    return `https://www.ebi.ac.uk/ols4/ontologies/duo/classes/${encodeURIComponent(
        encodeURIComponent(purl)
    )}`;
};

export interface DuoCodeChipsProps {
    codes: string | string[];
    details: Record<string, DuoCodeDetails>;
}

/**
 * GA4GH DUO codes as chips: a known code shows its shortcode with a tooltip
 * explaining it, an unknown one shows as-is. Shared by both dataset pages.
 */
const DuoCodeChips = ({ codes, details }: DuoCodeChipsProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const list = isArray(codes)
        ? codes
        : Array.from(new Set(splitStringList(codes)));

    return (
        <DatasetFieldWrapper sx={{ gap: 0.75 }}>
            {list.map(item => {
                const code = item.toString();
                const detail = details[code];

                if (!detail) {
                    return <DatasetFieldItem key={code} label={code} />;
                }

                const chipLabel = detail.shortcode || code;

                return (
                    <Tooltip
                        key={code}
                        describeChild
                        placement="top"
                        title={
                            <>
                                <Typography variant="subtitle1">
                                    {`${detail.label} (${code.replace(
                                        ":",
                                        " "
                                    )})`}
                                </Typography>
                                <Typography>{detail.description}</Typography>
                                <Link href={getOlsLinkForDuoCode(code)}>
                                    {t("viewOnOlsSite")}
                                </Link>
                            </>
                        }>
                        <DatasetFieldItem
                            label={chipLabel}
                            variant="outlined"
                            tabIndex={0}
                        />
                    </Tooltip>
                );
            })}
        </DatasetFieldWrapper>
    );
};

export default DuoCodeChips;
