import { Stack } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { Dayjs } from "dayjs";
import Button from "@/components/Button";
import DatePickerControlled from "./DatePickerControlled";

const meta: Meta<typeof DatePickerControlled> = {
    component: DatePickerControlled,
    title: "Forms/DatePickerControlled",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DatePickerControlled>;

const WrapperComponent = () => {
    return (
        <Stack alignItems="start">
            <DatePickerControlled
                name="Date"
                label="Dates"
                onChange={(newValue: Dayjs | null) =>
                    console.log("Updated data: ", newValue)
                }
            />
            <Button type="submit">Submit</Button>
        </Stack>
    );
};

export const Default: Story = {
    args: {},
    render: () => <WrapperComponent />,
};
