"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import InputWrapper from "@/components/InputWrapper";
import searchFormConfig from "@/config/forms/search";

interface SortProps {
    defaultValue?: string;
    sortName: string;
    submitAction: (value: string) => void;
}

const Sort = ({ defaultValue, sortName, submitAction }: SortProps) => {
    const { control, watch } = useForm({
        defaultValues: {
            [sortName]: defaultValue,
        },
    });

    const watchSort = watch(sortName);

    useEffect(() => {
        if (!watchSort) return;
        submitAction(watchSort);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchSort]);

    return (
        <InputWrapper
            control={control}
            {...searchFormConfig.sort}
            formControlSx={{
                marginBottom: 0,
            }}
        />
    );
};

export default Sort;
