import { convertFromRaw, EditorState } from 'draft-js';
import { debounce } from 'lodash';
import { markdownToDraft } from 'markdown-draft-js';
import React, { useCallback, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { WysiwygEditor } from '../../../commonComponents/WysiwygEditor/WysiwygEditor';

const CustomiseGuidance = ({ activeGuidance, isLocked, onGuidanceChange, activeQuestion }) => {
    const [editorState, setEditorState] = useState(null);

    const debounceChange = useCallback(
        debounce(guidanceAsMarkdown => {
            return onGuidanceChange(activeQuestion, guidanceAsMarkdown);
        }, 1500),
        [activeQuestion]
    );

    const handleGuidanceChange = markdown => {
        debounceChange(markdown);
    };

    const handleEditorStateChange = React.useCallback(
        editorStateChanged => {
            setEditorState(editorStateChanged);
        },
        [activeQuestion]
    );

    React.useEffect(() => {
        const contentState = convertFromRaw(markdownToDraft(activeGuidance));
        setEditorState(EditorState.createWithContent(contentState));
    }, [activeQuestion]);

    return (
        <>
            {isLocked ? (
                <>
                    {activeGuidance ? (
                        <ReactMarkdown source={activeGuidance} linkTarget='_blank' />
                    ) : (
                        'There is currently no guidance for this question'
                    )}
                </>
            ) : (
                editorState && (
                    <WysiwygEditor
                        data-testid='wysiwyg-editor'
                        editorState={editorState}
                        onEditorStateChange={handleEditorStateChange}
                        onMarkdownChange={handleGuidanceChange}
                    />
                )
            )}
        </>
    );
};

export default CustomiseGuidance;
