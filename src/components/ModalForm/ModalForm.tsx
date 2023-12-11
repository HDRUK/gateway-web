"use client";
import { IconButton } from "@mui/material";
import React, { ReactNode } from "react";
import useModal from "@/hooks/useModal";
import MultiInputWrapper from "@/components/MultiInputWrapper";
import { Control } from "react-hook-form";
import { dialogPropsType } from "@/providers/DialogProvider";

export interface ModalFormProps extends dialogPropsType {
    formFields: any;
    control: Control;
    content?: ReactNode;
}

const ModalForm = ({
    formFields,
    control,
    content,
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

    return <IconButton onClick={handleClick}>{content}</IconButton>;
};

export default ModalForm;
