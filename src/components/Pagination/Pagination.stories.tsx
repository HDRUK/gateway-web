import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Typography from "@/components/Typography";
import Pagination from "./Pagination";

/** Mui documentation: https://mui.com/material-ui/react-pagination / */

const meta: Meta<typeof Pagination> = {
    component: Pagination,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Pagination>;

const WrapperComponent = () => {
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

export const Default: Story = {
    render: () => <WrapperComponent />,
};
