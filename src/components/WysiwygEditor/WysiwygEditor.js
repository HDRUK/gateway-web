/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import { convertToRaw } from 'draft-js';
import { draftToMarkdown } from 'markdown-draft-js';
import PropTypes from 'prop-types';
import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import LayoutBox from '../LayoutBox';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
import * as styles from './WysiwygEditor.styles';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export const WysiwygEditor = ({
    editorState,
    onEditorStateChange,
    onContentStateChange,
    onMarkdownChange,
    toolbar,
    className,
    mt,
    mb,
    ml,
    mr,
    width,
    minWidth,
    maxWidth,
}) => {
    const [markdown, setMarkdown] = React.useState();
    const ref = React.createRef(null);

    const handleOnEditorStateChange = editorStateChanged => {
        const guidanceAsMarkdown = draftToMarkdown(convertToRaw(editorStateChanged.getCurrentContent()));

        onEditorStateChange(editorStateChanged);

        if (markdown !== guidanceAsMarkdown) onMarkdownChange(guidanceAsMarkdown, editorStateChanged);
    };

    React.useEffect(() => {
        setMarkdown(draftToMarkdown(convertToRaw(editorState.getCurrentContent())));
    }, []);

    return (
        <LayoutBox {...{ mt, mb, ml, mr, width, minWidth, maxWidth }} className={cx('ui-WysiwygEditor', className)} css={styles.root()}>
            <Editor
                data-testid='wysiwyg-editor-main'
                wrapperClassName='ui-WysiwygEditor__wrapper'
                editorClassName='ui-WysiwygEditor__editor'
                toolbarClassName='ui-WysiwygEditor__toolbar'
                editorState={editorState}
                onEditorStateChange={handleOnEditorStateChange}
                onContentStateChange={onContentStateChange}
                ref={ref}
                toolbar={toolbar}
            />
        </LayoutBox>
    );
};

WysiwygEditor.propTypes = {
    onMarkdownChange: PropTypes.func,
    onEditorStateChange: PropTypes.func,
    onContentStateChange: PropTypes.func,
    editorState: PropTypes.shape({
        getCurrentContent: PropTypes.func,
    }).isRequired,
    toolbar: PropTypes.shape({
        options: PropTypes.arrayOf(PropTypes.string),
        inline: {
            inDropdown: PropTypes.bool,
            options: PropTypes.arrayOf(PropTypes.string),
        },
        blockType: {
            inDropdown: PropTypes.bool,
            options: PropTypes.arrayOf(PropTypes.string),
        },
        list: {
            options: PropTypes.arrayOf(PropTypes.string),
        },
        link: {
            options: PropTypes.arrayOf(PropTypes.string),
        },
        history: {
            options: PropTypes.arrayOf(PropTypes.string),
        },
    }),
    ...PROP_TYPES_LAYOUTBOX,
};

WysiwygEditor.defaultProps = {
    onMarkdownChange: () => {},
    onEditorStateChange: () => {},
    onContentStateChange: () => {},
    toolbar: {
        options: ['inline', 'blockType', 'list', 'link', 'history'],
        inline: {
            inDropdown: false,
            options: ['bold', 'italic'],
        },
        blockType: {
            inDropdown: false,
            options: ['Normal', 'H1', 'H2'],
        },
        list: {
            options: ['unordered', 'ordered'],
        },
        link: {
            options: ['link'],
        },
        history: {
            options: ['undo', 'redo'],
        },
    },
};

export default WysiwygEditor;
