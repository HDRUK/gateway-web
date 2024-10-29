import { SearchResultCollection } from "@/interfaces/Search";
import CardStacked from "@/components/CardStacked";
import { StaticImages } from "@/config/images";
import { RouteName } from "@/consts/routeName";

interface ResultCardProps {
    result: SearchResultCollection;
}

const ResultCollectionCard = ({ result }: ResultCardProps) => {
    const { _id: id } = result;

    return (
        <CardStacked
            href={`/${RouteName.COLLECTION_ITEM}/${id}`}
            title={result.name}
            imgUrl={result?.image_link || StaticImages.BASE.placeholder}
        />
    );
};

export default ResultCollectionCard;
