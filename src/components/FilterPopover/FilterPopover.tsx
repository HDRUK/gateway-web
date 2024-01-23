import { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { IconButton, Popover } from "@mui/material";
import Box from "@/components/Box";
import RadioGroup from "@/components/RadioGroup";
import { FilterAltIcon, FilterAltOffIcon } from "@/consts/icons";

interface FilterPopoverProps<T> {
    setFilter: (filter: Partial<T>) => void;
    filter?: Partial<T>;
    radios: { label: string; value: string }[];
    name: string;
}

interface FilterCheckboxesProps<T> extends FilterPopoverProps<T> {
    handleClose: () => void;
}

const FilterCheckboxes = <T extends string>({
    filter,
    setFilter,
    radios,
    name,
    handleClose,
}: FilterCheckboxesProps<T>) => {
    const { control } = useForm({
        defaultValues: filter ? { [name]: filter } : ({} as FieldValues),
    });

    const handleChange = (value: Partial<T>) => {
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
                        _event: React.MouseEvent<HTMLElement>,
                        value: Partial<T>
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

const FilterPopover = <T extends string>({
    filter,
    setFilter,
    name,
    radios,
}: FilterPopoverProps<T>) => {
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
