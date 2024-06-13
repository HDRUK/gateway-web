import { SearchResultCollection } from "@/interfaces/Search";
import { RouteName } from "@/consts/routeName";
import CardStacked from "../CardStacked/CardStacked";

interface ResultCardProps {
    result: SearchResultCollection;
    imgUrl: string;
}

const ResultCollectionCard = ({ result, imgUrl }: ResultCardProps) => {
    return (
        <CardStacked
            // eslint-disable-next-line no-underscore-dangle
            href={`${RouteName.COLLECTION_ITEM}/${result._id}`}
            title={result.name}
            imgUrl={imgUrl}
        />
    );
};

export default ResultCollectionCard;
