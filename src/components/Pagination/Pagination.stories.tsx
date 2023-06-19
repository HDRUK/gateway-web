import { Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Pagination from "./Pagination";

const meta: Meta<typeof Pagination> = {
    component: Pagination,
};

export default meta;

type Story = StoryObj<typeof Pagination>;

const DummyComponent = () => {
    const [pageNumber, setPageNumber] = useState(1);

    const changeHandler = (_: unknown, page: number) => {
        setPageNumber(page);
    };
    return (
        <>
            <Typography sx={{ marginBottom: "10px" }}>
                Page number {pageNumber}
            </Typography>
            <Pagination
                count={5}
                onChange={changeHandler}
                variant="outlined"
                shape="rounded"
            />
        </>
    );
};

export const PaginationComponent: Story = {
    render: () => <DummyComponent />,
};
