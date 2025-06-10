"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { IconType } from "@/interfaces/Ui";
import InputWrapper from "@/components/InputWrapper";
import searchFormConfig from "@/config/forms/search";
import { DownloadIcon } from "@/consts/icons";

type Options = {
    label: string;
    value: string;
    icon: IconType;
};

interface SortProps {
    defaultValue?: string;
    sortName: string;
    submitAction: (value: string) => void;
    sortOptions: Options[];
    iconised: boolean;
}

const Sort = ({
    defaultValue,
    sortName,
    submitAction,
    sortOptions,
    iconised,
}: SortProps) => {
    const { control, watch, reset, setValue } = useForm({
        defaultValues: {
            [sortName]: defaultValue,
        },
    });

    const [options, setOptions] = useState<Options[]>([]);

    const watchSort = watch(sortName);

    useEffect(() => {
        if (!watchSort) return;
        submitAction(watchSort);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchSort]);

    useEffect(() => {
        if (!watchSort) return;

        if (sortOptions.some(option => option.value === watchSort)) {
            setOptions(sortOptions);
        } else {
            reset();
        }
    }, [reset, sortOptions, watchSort]);

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = e => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    if (!iconised) {
        return (
            <InputWrapper
                control={control}
                {...searchFormConfig.sort}
                options={options}
                formControlSx={{
                    marginBottom: 0,
                }}
            />
        );
    } else {
        return (
            <>
                <IconButton
                    aria-controls="sort-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    aria-label="Open to show sort options"
                    title="Open to show sort options">
                    <DownloadIcon />
                </IconButton>
                <Menu
                    id="sort-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}>
                    {options.map(item => {
                        const handleCloseInner = () => {
                            setValue(sortName, item.value);
                            handleClose();
                        };
                        return (
                            <MenuItem
                                onClick={handleCloseInner}
                                key={item.label}
                                value={item.value}>
                                <item.icon sx={{ mr: 1 }} /> {item.label}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </>
        );
    }
};

export default Sort;
