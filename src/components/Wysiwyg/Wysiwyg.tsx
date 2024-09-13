import { useCallback, useEffect, useState } from "react";
import { FieldValues, Path, useController } from "react-hook-form";
import { Box } from "@mui/material";
import { createEditor, Descendant, Editor, Transforms } from "slate";
import { ReactEditor, Slate, withReact } from "slate-react";
import { parseEncodedJSON } from "@/utils/json";
import FormInputWrapper from "../FormInputWrapper";
import { TextFieldBaseProps } from "../TextFieldBase";
import TextEditor from "./TextEditor";

const Wysiwyg = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
    control,
    ...props
}: TextFieldBaseProps<TFieldValues, TName>) => {
    const [editor] = useState(() => withReact(createEditor()));
    const [updated, setUpdated] = useState(false);

    const { name, label, info } = props;

    const { field } = useController({
        name,
        control,
    });

    const initialValue = field.value
        ? typeof field.value === "string"
            ? parseEncodedJSON(field.value)
            : field.value
        : [
              {
                  type: "paragraph",
                  children: [{ text: "" }],
              },
          ];

    const handleChange = useCallback(
        (data: Descendant[]) => {
            if (!updated) setUpdated(updated);

            field.onChange(JSON.stringify(data));
        },
        [updated]
    );

    const handleLabelClick = useCallback(() => {
        ReactEditor.focus(editor);
    }, [updated]);

    useEffect(() => {
        Transforms.delete(editor, {
            at: {
                anchor: Editor.start(editor, []),
                focus: Editor.end(editor, []),
            },
        });

        Transforms.removeNodes(editor, {
            at: [0],
        });

        Transforms.insertNodes(editor, initialValue);
    }, [initialValue]);

    return (
        <FormInputWrapper
            info={info}
            label={label}
            onLabelClick={handleLabelClick}>
            <Box sx={{ mt: "3px" }}>
                <Slate
                    editor={editor}
                    initialValue={initialValue}
                    onChange={handleChange}>
                    <TextEditor editor={editor} />
                </Slate>
            </Box>
        </FormInputWrapper>
    );
};

export default Wysiwyg;
