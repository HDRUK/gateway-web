import { Box, BoxProps } from "@mui/material";
import { isEmpty } from "lodash";
import { DataProvider } from "@/interfaces/DataProvider";
import Link from "@/components/Link";

interface TrailingContentProps extends BoxProps {
    data: DataProvider;
}

const TrailingContent = ({ data, ...restProps }: TrailingContentProps) => {
    if (![data.url].filter(value => !isEmpty(value)).length) {
        return null;
    }

    return (
        <Box {...restProps}>
            {data.url && <Link href={data.url}>{data.url}</Link>}
        </Box>
    );
};

export default TrailingContent;
