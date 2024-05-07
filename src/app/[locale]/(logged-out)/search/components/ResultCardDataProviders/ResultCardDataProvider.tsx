import { SearchResultDataProvider } from "@/interfaces/Search";
import { RouteName } from "@/consts/routeName";
import CardStacked from "../CardStacked/CardStacked";

interface ResultCardDataProviderProps {
    result: SearchResultDataProvider;
    imgUrl: string;
}

const ResultCardDataProvider = ({
    result,
    imgUrl,
}: ResultCardDataProviderProps) => {
    return (
        <CardStacked
            // eslint-disable-next-line no-underscore-dangle
            href={`${RouteName.DATA_PROVIDERS_ITEM}/${result._id}`}
            title={result.name}
            imgUrl={imgUrl}
        />
    );
};

export default ResultCardDataProvider;
