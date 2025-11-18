import CollectionForm from "@/components/CollectionForm";
import { getKeywords, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";

export const metadata = metaData(
    {
        title: "Edit Collection - My Account",
        description: "Edit a collection",
    },
    noFollowRobots
);

export default async function CollectionEditPage({
    params,
}: {
    params: Promise<{ collectionId: string }>;
}) {
    const { collectionId } = await params;
    const user = await getUser();
    const userId = user?.id?.toString();
    const keywords = await getKeywords();
    const keywordOptions = keywords.map(data => {
        return {
            value: data.id as ValueType,
            label: data.name,
        };
    });
    return (
        <CollectionForm
            collectionId={collectionId}
            userId={userId}
            keywordOptions={keywordOptions}
        />
    );
}
