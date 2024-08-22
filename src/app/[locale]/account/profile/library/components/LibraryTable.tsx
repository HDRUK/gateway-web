"use client";

import { useTranslations } from "next-intl";
import {
    LibraryListItem,
    Library,
    SelectedLibrary,
} from "@/interfaces/Library";
import Table from "@/components/Table";
import { getColumns } from "../utils";

const TRANSLATION_PATH = "pages.account.profile.library";

interface LibraryTableProps {
    data: Library[];
    selected: SelectedLibrary;
    handleSelect: (data: SelectedLibrary) => void;
    handleRemove: (id: string) => void;
}

const LibraryTable = ({
    data,
    selected,
    handleSelect,
    handleRemove,
}: LibraryTableProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    console.log(data);
    const results = data?.map(item => ({
        id: item.id,
        datasetId: item.dataset_id,
        name: item.dataset_name,
        darEnabled: item.data_provider_dar_enabled,
        dataCustodian: item.data_provider_name,
        entityType: "Dataset", // will we update in the future with other entities?
        dataCustodianId: item.data_provider_id,
        dataCustodianMemberOf: item.data_provider_member_of,
    }));
    console.log("results", results);
    const translations = {
        name: t("name.label"),
        darEnabled: t("darEnabled.label"),
        dataCustodian: t("dataCustodian.label"),
        entityType: t("entityType.label"),
    };

    return (
        <Table<LibraryListItem>
            columns={getColumns({
                handleSelect,
                handleRemove,
                selected,
                translations,
            })}
            rows={results}
        />
    );
};

export default LibraryTable;
