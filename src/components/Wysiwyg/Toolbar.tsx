import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { IconButton } from "@mui/material";
import { Editor } from "slate";
import { Blocks, Marks, TextAlign } from "@/interfaces/Wysiwyg";
import { StyledToolbar } from "./Wysiwyg.styles";

interface ToolbarProps {
    editor: Editor;
    onChangeMark(editor: Editor, format: Marks): void;
    onChangeBlock(editor: Editor, type: any): void;
}

function Toolbar({ editor, onChangeBlock, onChangeMark }: ToolbarProps) {
    return (
        <StyledToolbar>
            <li>
                <IconButton
                    size="small"
                    onPointerDown={() => {
                        onChangeMark(editor, Marks.BOLD);
                    }}>
                    <FormatBoldIcon />
                </IconButton>
            </li>
            <li>
                <IconButton
                    size="small"
                    onPointerDown={() => {
                        onChangeMark(editor, Marks.ITALIC);
                    }}>
                    <FormatItalicIcon />
                </IconButton>
            </li>
            <li>
                <IconButton
                    size="small"
                    onPointerDown={() => {
                        onChangeMark(editor, Marks.UNDERLINE);
                    }}>
                    <FormatUnderlinedIcon />
                </IconButton>
            </li>
            <li>
                <IconButton
                    size="small"
                    onPointerDown={() => {
                        onChangeBlock(editor, Blocks.BULLETED_LIST);
                    }}>
                    <FormatListBulletedIcon />
                </IconButton>
            </li>
            <li>
                <IconButton
                    size="small"
                    onPointerDown={() => {
                        onChangeBlock(editor, Blocks.NUMBERED_LIST);
                    }}>
                    <FormatListNumberedIcon />
                </IconButton>
            </li>
            <li>
                <IconButton
                    size="small"
                    onPointerDown={() => {
                        onChangeBlock(editor, TextAlign.LEFT);
                    }}>
                    <FormatAlignLeftIcon />
                </IconButton>
            </li>
            <li>
                <IconButton
                    size="small"
                    onPointerDown={() => {
                        onChangeBlock(editor, TextAlign.RIGHT);
                    }}>
                    <FormatAlignRightIcon />
                </IconButton>
            </li>
            <li>
                <IconButton
                    size="small"
                    onPointerDown={() => {
                        onChangeBlock(editor, TextAlign.CENTER);
                    }}>
                    <FormatAlignCenterIcon />
                </IconButton>
            </li>
        </StyledToolbar>
    );
}

export default Toolbar;
