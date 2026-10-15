import { SearchResultDataCustodian } from "@/interfaces/Search";
import CardStacked from "@/components/CardStacked";
import { StaticImages } from "@/config/images";
import { RouteName } from "@/consts/routeName";

interface ResultCardDataCustodianProps {
    result: SearchResultDataCustodian;
}

const ResultCardDataCustodian = ({ result }: ResultCardDataCustodianProps) => {
    const { _id: id } = result;

    return (
        <CardStacked
            href={`${RouteName.DATA_CUSTODIANS_ITEM}/${id}`}
            title={result.name}
            imgUrl={result?.team_logo || StaticImages.BASE.placeholder}
        />
    );
};

export default ResultCardDataCustodian;
