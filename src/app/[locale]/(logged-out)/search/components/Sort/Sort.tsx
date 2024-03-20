"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputWrapper from "@/components/InputWrapper";
import searchFormConfig from "@/config/forms/search";

type Options = {
    label: string;
    value: string;
};

interface SortProps {
    defaultValue?: string;
    sortName: string;
    submitAction: (value: string) => void;
    sortOptions: Options[];
}

const Sort = ({
    defaultValue,
    sortName,
    submitAction,
    sortOptions,
}: SortProps) => {
    const { control, watch, reset } = useForm({
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
};

export default Sort;
