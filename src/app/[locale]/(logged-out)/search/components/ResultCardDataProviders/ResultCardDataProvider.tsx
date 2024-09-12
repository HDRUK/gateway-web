import { SearchResultDataProvider } from "@/interfaces/Search";
import { RouteName } from "@/consts/routeName";
import CardStacked from "../CardStacked/CardStacked";

interface ResultCardDataProviderProps {
    result: SearchResultDataProvider;
}

const DEFAULT_IMAGE_URL = `${process.env.NEXT_PUBLIC_MEDIA_STATIC_URL}/default_placeholder.png`;

const ResultCardDataProvider = ({ result }: ResultCardDataProviderProps) => {
    const { _id: id } = result;

    return (
        <CardStacked
            href={`${RouteName.DATA_PROVIDERS_ITEM}/${id}`}
            title={result.name}
            imgUrl={result?.team_logo || DEFAULT_IMAGE_URL}
        />
    );
};

export default ResultCardDataProvider;
