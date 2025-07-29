"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@mui/material";
import { IntegrationHistory } from "@/interfaces/IntegrationHistory";
import TickCrossIcon from "@/components/TickCrossIcon";
import { colors } from "@/config/theme";

const IntegrationHistoryTable = ({
    integrations,
}: {
    integrations: Array<IntegrationHistory>;
}) => {
    const rows = integrations.map(x => (
        <TableRow>
            <TableCell>
                {x.run_time}
                {!x.success && (
                    <Typography color={colors.red600}>{x.message}</Typography>
                )}
            </TableCell>
            <TableCell>
                <TickCrossIcon isTrue={x.success} />
            </TableCell>
        </TableRow>
    ));

    return (
        <TableContainer sx={{ width: "100%" }}>
            <Table>
                <TableBody>{rows}</TableBody>
            </Table>
        </TableContainer>
    );
};

export default IntegrationHistoryTable;
