"use client";

import { useRouter } from "next/navigation";
import { SearchCategory } from "@/interfaces/Search";
import { RouteName } from "@/consts/routeName";
import { decodeHtmlEntity } from "@/utils/general";
import {
    DatasetButtonItem,
    DatasetFieldWrapper,
} from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/DatasetContent/DatasetContent.styles";

/**
 * The production page's LIST_TAG field: each value a green button that runs a
 * dataset search for it. Same components and route as DatasetContent.
 */
const SearchTags = ({ tags }: { tags: string[] }) => {
    const router = useRouter();

    return (
        <DatasetFieldWrapper>
            {tags.map(tag => {
                const label = decodeHtmlEntity(tag);
                return (
                    <DatasetButtonItem
                        key={label}
                        color="success"
                        size="small"
                        onClick={() =>
                            router.push(
                                `/${RouteName.SEARCH}?type=${
                                    SearchCategory.DATASETS
                                }&query=${encodeURIComponent(label)}`
                            )
                        }>
                        {label}
                    </DatasetButtonItem>
                );
            })}
        </DatasetFieldWrapper>
    );
};

export default SearchTags;
