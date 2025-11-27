"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@mui/material";
import { IntegrationHistory } from "@/interfaces/IntegrationHistory";
import { PaginationType } from "@/interfaces/Pagination";
import Box from "@/components/Box";
import Pagination from "@/components/Pagination";
import TickCrossIcon from "@/components/TickCrossIcon";
import { colors } from "@/config/theme";

const IntegrationHistoryTable = () => {
    const [currentPage, setCurrentPage] = useState(1);

    // Example, put data fetching in here
    const data: PaginationType<IntegrationHistory> = {
        lastPage: 1,
        to: 1,
        from: 1,
        currentPage: 1,
        total: 1,
        list: [
            {
                run_time: "21 September 2025 12:00",
                success: false,
                message: "Resource not found",
            },
            {
                run_time: "20 September 2025 17:00",
                success: true,
            },
            {
                run_time: "19 September 2025 08:15",
                success: false,
                message: "Internal server error",
            },
        ],
    };

    const { lastPage, list } = data;

    const rows = list.map(x => (
        <TableRow key={x?.message}>
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
        <Box>
            <TableContainer sx={{ width: "100%" }}>
                <Table>
                    <TableBody>{rows}</TableBody>
                </Table>
            </TableContainer>
            <Pagination
                isLoading={false}
                page={currentPage}
                count={lastPage}
                onChange={(e: React.ChangeEvent<unknown>, page: number) =>
                    setCurrentPage(page)
                }
            />
        </Box>
    );
};

export default IntegrationHistoryTable;
