import { useCallback } from "react";
import CodeIcon from "@mui/icons-material/Code";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import { IconButton } from "@mui/material";
import { Editor } from "@tiptap/react";
import { ButtonType } from "@/interfaces/Wysiwyg";
import { StyledToolbar } from "./Wysiwyg.styles";

export type ToolbarButtons = ButtonType[];

interface ToolbarProps {
    editor: Editor;
    includeButtons?: ButtonType[];
}

function Toolbar({
    editor,
    includeButtons = [
        ButtonType.BOLD,
        ButtonType.ITALIC,
        ButtonType.UNDERLINE,
        ButtonType.REDO,
        ButtonType.UNDO,
        ButtonType.UNDERLINE,
    ],
}: ToolbarProps) {
    const toggleBold = useCallback(() => {
        editor.chain().focus().toggleBold().run();
    }, [editor]);

    const toggleUnderline = useCallback(() => {
        editor.chain().focus().toggleUnderline().run();
    }, [editor]);

    const toggleItalic = useCallback(() => {
        editor.chain().focus().toggleItalic().run();
    }, [editor]);

    const handleUndo = useCallback(
        () => editor.chain().focus().undo().run(),
        [editor]
    );

    const handleRedo = useCallback(
        () => editor.chain().focus().undo().run(),
        [editor]
    );

    const toggleCode = useCallback(() => {
        editor.chain().focus().toggleCode().run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <StyledToolbar>
            {includeButtons.includes(ButtonType.UNDO) && (
                <li>
                    <IconButton
                        size="small"
                        onClick={handleUndo}
                        disabled={!editor.can().undo()}>
                        <UndoIcon />
                    </IconButton>
                </li>
            )}
            {includeButtons.includes(ButtonType.REDO) && (
                <li>
                    <IconButton
                        size="small"
                        onClick={handleRedo}
                        disabled={!editor.can().redo()}>
                        <RedoIcon />
                    </IconButton>
                </li>
            )}
            {includeButtons.includes(ButtonType.BOLD) && (
                <li>
                    <IconButton size="small" onClick={toggleBold}>
                        <FormatBoldIcon />
                    </IconButton>
                </li>
            )}
            {includeButtons.includes(ButtonType.ITALIC) && (
                <li>
                    <IconButton size="small" onPointerDown={toggleItalic}>
                        <FormatItalicIcon />
                    </IconButton>
                </li>
            )}
            {includeButtons.includes(ButtonType.UNDERLINE) && (
                <li>
                    <IconButton size="small" onPointerDown={toggleUnderline}>
                        <FormatUnderlinedIcon />
                    </IconButton>
                </li>
            )}
            {includeButtons.includes(ButtonType.CODE) && (
                <li>
                    <IconButton size="small" onPointerDown={toggleCode}>
                        <CodeIcon />
                    </IconButton>
                </li>
            )}
        </StyledToolbar>
    );
}

export default Toolbar;
