"use client";

import React, { ReactNode } from "react";
import { Control } from "react-hook-form";
import { IconButton } from "@mui/material";
import { FormField } from "@/interfaces/FormField";
import MultiInputWrapper from "@/components/MultiInputWrapper";
import useModal from "@/hooks/useModal";

export interface ModalFormProps {
    formFields: FormField;
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
