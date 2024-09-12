import { SearchResultCollection } from "@/interfaces/Search";
import { RouteName } from "@/consts/routeName";
import CardStacked from "../CardStacked/CardStacked";

interface ResultCardProps {
    result: SearchResultCollection;
}

const DEFAULT_IMAGE_URL = `${process.env.NEXT_PUBLIC_MEDIA_STATIC_URL}/default_placeholder.png`;

const ResultCollectionCard = ({ result }: ResultCardProps) => {
    const { _id: id } = result;

    return (
        <CardStacked
            href={`${RouteName.COLLECTION_ITEM}/${id}`}
            title={result.name}
            imgUrl={result?.image_link || DEFAULT_IMAGE_URL}
        />
    );
};

export default ResultCollectionCard;
