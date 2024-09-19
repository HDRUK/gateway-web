import { SearchResultCollection } from "@/interfaces/Search";
import { StaticImages } from "@/config/images";
import { RouteName } from "@/consts/routeName";
import CardStacked from "../CardStacked/CardStacked";

interface ResultCardProps {
    result: SearchResultCollection;
}

const ResultCollectionCard = ({ result }: ResultCardProps) => {
    const { _id: id, team } = result;
    let imgUrl = result?.image_link || StaticImages.BASE.placeholder;

    if (team?.team_image) {
        imgUrl = team?.team_image;
    }

    return (
        <CardStacked
            href={`${RouteName.COLLECTION_ITEM}/${id}`}
            title={result.name}
            imgUrl={imgUrl}
        />
    );
};

export default ResultCollectionCard;
