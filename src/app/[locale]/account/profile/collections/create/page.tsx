import CollectionForm from "@/components/CollectionForm";
import { getKeywords, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";

export const metadata = metaData(
    {
        title: "Create Collection - My Account",
        description: "Create a collection",
    },
    noFollowRobots
);

export default async function CollectionCreatePage() {
    const user = await getUser();
    const userId = user?.id?.toString();
    const keywords = await getKeywords();
    const keywordOptions = keywords.map(data => {
        return {
            value: data.id as ValueType,
            label: data.name,
        };
    });
    return <CollectionForm userId={userId} keywordOptions={keywordOptions} />;
}
