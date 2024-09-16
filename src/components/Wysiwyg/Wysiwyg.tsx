import { useCallback } from "react";
import { FieldValues, Path, useController } from "react-hook-form";
import { Box } from "@mui/material";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import FormInputWrapper from "../FormInputWrapper";
import { TextFieldBaseProps } from "../TextFieldBase";
import Toolbar from "./Toolbar";
import { StyledEditorWrapper } from "./Wysiwyg.styles";
import { EXTENSIONS } from "./consts";

const Wysiwyg = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
    control,
    ...props
}: TextFieldBaseProps<TFieldValues, TName>) => {
    const { name, label, info } = props;

    const { field } = useController({
        name,
        control,
    });

    const editor = useEditor({
        extensions: EXTENSIONS,
        onUpdate({ editor }) {
            field.onChange(JSON.stringify(editor.getJSON()));
        },
    }) as Editor;

    const handleLabelClick = useCallback(() => {
        editor.commands.focus("start");
        // ReactEditor.focus(editor);
    }, []);

    return (
        <FormInputWrapper
            info={info}
            label={label}
            name={name}
            onLabelClick={handleLabelClick}>
            <Box sx={{ mt: "3px" }}>
                <Toolbar editor={editor} />
                <StyledEditorWrapper>
                    <EditorContent editor={editor} name={name} />
                </StyledEditorWrapper>
            </Box>
        </FormInputWrapper>
    );
};

export default Wysiwyg;
