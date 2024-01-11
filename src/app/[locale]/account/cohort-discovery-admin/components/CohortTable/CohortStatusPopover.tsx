import Box from "@/components/Box";
import RadioGroup from "@/components/RadioGroup";
import { FilterAltIcon, FilterAltOffIcon } from "@/consts/icons";
import { CohortRequestStatus } from "@/interfaces/CohortRequest";
import { IconButton, Popover } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface CohortStatusPopoverProps {
    setRequestStatus: (status: CohortRequestStatus) => void;
    requestStatus?: CohortRequestStatus;
}

interface StatusCheckboxesProps extends CohortStatusPopoverProps {
    handleClose: () => void;
}

const StatusCheckboxes = ({
    requestStatus,
    setRequestStatus,
    handleClose,
}: StatusCheckboxesProps) => {
    const { control } = useForm({
        defaultValues: { request_status: requestStatus },
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRequestStatus(
            (event.target as HTMLInputElement).value as CohortRequestStatus
        );
        handleClose();
    };

    return (
        <Box
            sx={{
                zIndex: 9999,
            }}>
            <form>
                <RadioGroup
                    radios={[
                        { label: "All", value: "" },
                        { label: "Approved", value: "APPROVED" },
                        { label: "Pending", value: "PENDING" },
                        { label: "Rejected", value: "REJECTED" },
                        { label: "Banned", value: "BANNED" },
                        { label: "Suspended", value: "SUSPENDED" },
                        { label: "Expired", value: "EXPIRED" },
                    ]}
                    onChange={handleChange}
                    label=""
                    name="request_status"
                    control={control}
                />
            </form>
        </Box>
    );
};

const CohortStatusPopover = ({
    requestStatus,
    setRequestStatus,
}: CohortStatusPopoverProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "status-popover" : undefined;

    const FilterIcon = requestStatus ? FilterAltIcon : FilterAltOffIcon;

    return (
        <>
            <IconButton sx={{ p: 0 }} disableRipple onClick={handlePopoverOpen}>
                <FilterIcon fontSize="small" />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}>
                <StatusCheckboxes
                    handleClose={handlePopoverClose}
                    requestStatus={requestStatus}
                    setRequestStatus={setRequestStatus}
                />
            </Popover>
        </>
    );
};

export { CohortStatusPopover };
