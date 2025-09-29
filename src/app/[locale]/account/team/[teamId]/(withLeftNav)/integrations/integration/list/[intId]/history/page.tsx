"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { IntegrationHistory } from "@/interfaces/IntegrationHistory";
import { PaginationType } from "@/interfaces/Pagination";
import Pagination from "@/components/Pagination";
import IntegrationHistoryTable from "../components/IntegrationHistoryTable";

export default function IntegrationHistoryPage() {
    const [currentPage, setCurrentPage] = useState(1);

    const data: PaginationType<IntegrationHistory> = {
        lastPage: 3,
        to: 1,
        from: 3,
        currentPage: 1,
        total: 3,
        list: [
            {
                run_time: "12 March 2025 14:00",
                success: false,
                message: "An error occured",
            },
            {
                run_time: "11 March 2025 14:00",
                success: true,
            },
            {
                run_time: "10 March 2025 14:00",
                success: true,
            },
        ],
    };

    const { lastPage, list } = data || {};

    return (
        <Box sx={{ width: "100%" }}>
            <IntegrationHistoryTable integrations={list} />
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
}
