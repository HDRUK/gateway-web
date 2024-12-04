import { useCallback } from "react";
import CodeIcon from "@mui/icons-material/Code";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import LinkIcon from "@mui/icons-material/Link";
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
        ButtonType.BULLETED_LIST,
        ButtonType.NUMBERED_LIST,
        ButtonType.LINK,
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

    const toggleBulletedList = useCallback(() => {
        editor.chain().focus().toggleBulletList().run();
    }, [editor]);

    const toggleOrderedList = useCallback(() => {
        editor.chain().focus().toggleOrderedList().run();
    }, [editor]);

    const toggleLink = useCallback(() => {
        const url = prompt("Enter the URL:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
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
            {includeButtons.includes(ButtonType.BULLETED_LIST) && (
                <li>
                    <IconButton size="small" onPointerDown={toggleBulletedList}>
                        <FormatListBulletedIcon />
                    </IconButton>
                </li>
            )}
            {includeButtons.includes(ButtonType.NUMBERED_LIST) && (
                <li>
                    <IconButton size="small" onPointerDown={toggleOrderedList}>
                        <FormatListNumberedIcon />
                    </IconButton>
                </li>
            )}
            {includeButtons.includes(ButtonType.LINK) && (
                <li>
                    <IconButton size="small" onPointerDown={toggleLink}>
                        <LinkIcon />
                    </IconButton>
                </li>
            )}
        </StyledToolbar>
    );
}

export default Toolbar;
