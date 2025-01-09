import { cookies } from "next/headers";
import CollectionForm from "@/components/CollectionForm";
import { getUser } from "@/utils/api";
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
    params: { collectionId: string };
}) {
    const { collectionId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const userId = user?.id?.toString();
    const keywords = await getKeywords(cookieStore);
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
