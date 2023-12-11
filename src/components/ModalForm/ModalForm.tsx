"use client";
import { DownloadIcon } from "@/consts/icons";
import { IconButton, Typography } from "@mui/material";
import React from "react";
import useModal from "@/hooks/useModal";
import MultiInputWrapper from "@/components/MultiInputWrapper";
import { Control } from "react-hook-form";
import { dialogPropsType } from "@/providers/DialogProvider";

export interface ModalFormProps extends dialogPropsType {
    formFields: any;
    control: Control;
    label: string;
    ariaLabel: string;
}

const ModalForm = ({
    formFields,
    control,
    label,
    ariaLabel,
    ...rest
}: ModalFormProps) => {
    const { showModal } = useModal();

    const handleClick = () => {
        showModal({
            content: (
                <>
                    <MultiInputWrapper fields={formFields} control={control} />
                </>
            ),
            ...rest,
        });
    };

    return (
        <IconButton onClick={handleClick} aria-label={ariaLabel}>
            <Typography color="primary">
                <DownloadIcon color="primary" />
                {label}
            </Typography>
        </IconButton>
    );
};

export default ModalForm;
