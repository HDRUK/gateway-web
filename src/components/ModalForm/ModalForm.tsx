"use client";

import { IconButton } from "@mui/material";
import React, { ReactNode } from "react";
import useModal from "@/hooks/useModal";
import MultiInputWrapper from "@/components/MultiInputWrapper";
import { CohortExportForm } from "@/interfaces/CohortExport";
import { Control } from "react-hook-form";

export interface ModalFormProps {
    formFields: CohortExportForm;
    control: Control;
    buttonContent?: ReactNode;
}

const ModalForm = ({
    formFields,
    control,
    buttonContent,
    ...rest
}: ModalFormProps) => {
    const { showModal } = useModal();

    const handleClick = () => {
        showModal({
            content: (
                <MultiInputWrapper fields={formFields} control={control} />
            ),
            ...rest,
        });
    };

    return <IconButton onClick={handleClick}>{buttonContent}</IconButton>;
};

export default ModalForm;
