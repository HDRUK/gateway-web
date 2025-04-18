import { ChangeEvent, useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { IconButton, Popover } from "@mui/material";
import Box from "@/components/Box";
import RadioGroup from "@/components/RadioGroup";
import { FilterAltIcon, FilterAltOffIcon } from "@/consts/icons";

interface FilterPopoverProps {
    setFilter: (filter: string) => void;
    filter?: string;
    radios: { label: string; value: string }[];
    name: string;
}

interface FilterCheckboxesProps extends FilterPopoverProps {
    handleClose: () => void;
}

const FilterCheckboxes = ({
    filter,
    setFilter,
    radios,
    name,
    handleClose,
}: FilterCheckboxesProps) => {
    const { control } = useForm({
        defaultValues: filter ? { [name]: filter } : ({} as FieldValues),
    });

    const handleChange = (value: string) => {
        setFilter(value);
        handleClose();
    };

    return (
        <Box
            sx={{
                zIndex: 9999,
            }}>
            <form>
                <RadioGroup
                    radios={radios}
                    onChange={(
                        _event: ChangeEvent<HTMLInputElement>,
                        value: string
                    ) => handleChange(value)}
                    label=""
                    name={name}
                    control={control}
                    value={filter}
                />
            </form>
        </Box>
    );
};

const FilterPopover = ({
    filter,
    setFilter,
    name,
    radios,
}: FilterPopoverProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "filter-popover" : undefined;

    const FilterIcon = filter ? FilterAltIcon : FilterAltOffIcon;

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
                <FilterCheckboxes
                    name={name}
                    radios={radios}
                    handleClose={handlePopoverClose}
                    filter={filter}
                    setFilter={setFilter}
                />
            </Popover>
        </>
    );
};

export default FilterPopover;
