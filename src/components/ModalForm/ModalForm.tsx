"use client";

import React, { ReactNode } from "react";
import { Control, FieldValues } from "react-hook-form";
import { IconButton } from "@mui/material";
import { FormField } from "@/interfaces/FormField";
import MultiInputWrapper from "@/components/MultiInputWrapper";
import useModal from "@/hooks/useModal";

export interface ModalFormProps<T extends FieldValues> {
    formFields: FormField[];
    control: Control<T>;
    buttonContent?: ReactNode;
    onSuccess: (data: unknown) => void;
    onCancel: (data: unknown) => void;
    confirmText: string;
    cancelText: string;
    title: string;
}

const ModalForm = <T extends FieldValues>({
    formFields,
    control,
    buttonContent,
    ...rest
}: ModalFormProps<T>) => {
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
