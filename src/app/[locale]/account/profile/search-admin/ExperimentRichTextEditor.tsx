"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { RichTextEditorProps } from "@hdruk/experiments/builder";
import { Wysiwyg } from "@/components/Wysiwyg";

export default function ExperimentRichTextEditor({
    label,
    value,
    onChange,
}: RichTextEditorProps) {
    const { control } = useForm({ defaultValues: { content: value } });
    const content = useWatch({ control, name: "content" });

    useEffect(() => {
        if (content !== value) {
            onChange(content);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    return <Wysiwyg control={control} name="content" label={label} />;
}
