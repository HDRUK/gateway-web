import { SearchResultDataProvider } from "@/interfaces/Search";
import CardStacked from "@/components/CardStacked";
import { StaticImages } from "@/config/images";
import { RouteName } from "@/consts/routeName";

interface ResultCardDataProviderProps {
    result: SearchResultDataProvider;
}

const ResultCardDataProvider = ({ result }: ResultCardDataProviderProps) => {
    const { _id: id } = result;

    return (
        <CardStacked
            href={`${RouteName.DATA_PROVIDERS_ITEM}/${id}`}
            title={result.name}
            imgUrl={result?.team_logo || StaticImages.BASE.placeholder}
        />
    );
};

export default ResultCardDataProvider;
