/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useCallback, useRef, useState } from 'react';
import { filesize } from 'humanize';
import * as styles from './FileSelector.styles';
import Button from '../Button';
import Typography, { H5 } from '../Typography';
import LayoutBox from '../LayoutBox';
import Icon from '../Icon';

import { ReactComponent as JsonIcon } from '../../images/icons/json.svg';

const FileSelector = ({ children, fileTypes, maxFileSize, noFilesMessage, multiple, actions }) => {
    const fileRef = useRef(null);
    const [fileList, setFileList] = useState([]);

    const handleSelectClick = useCallback(() => {
        const { current } = fileRef;
        if (current) {
            current.click();
        }
    }, [fileRef.current]);

    const handleFileChange = useCallback(e => {
        setFileList(e.target.files);
    }, []);

    const handleRemoveFile = name => {
        const files = [...fileList].filter(file => file.name !== name);

        fileRef.current.value = '';

        setFileList(files);
    };

    return (
        <div css={styles.root}>
            <input type='file' ref={fileRef} accept={`.${fileTypes.join(', .')}`} onChange={handleFileChange} multiple={multiple} />
            <LayoutBox display='flex' alignItems='center' mb={10}>
                <Button variant='tertiary' mr={3} onClick={handleSelectClick}>
                    Select file
                </Button>
                <Typography color='grey600' variant='caption'>
                    <div>File type: {fileTypes.join(',')}</div>
                    <div>Max size: {filesize(maxFileSize, 1000, 0)} per file</div>
                </Typography>
            </LayoutBox>
            {!fileList.length && (
                <LayoutBox display='flex' justifyContent='center'>
                    <Typography variant='caption'>{noFilesMessage}</Typography>
                </LayoutBox>
            )}
            {!!fileList.length && (
                <>
                    <H5 mb={5}>All Files</H5>
                    <table css={styles.table}>
                        <thead>
                            <tr>
                                <th>File</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...fileList].map(({ name }) => {
                                return (
                                    <tr key={name}>
                                        <td css={styles.nameColumn}>
                                            <LayoutBox display='flex' alignItems='center' style={{ width: '100px', overflow: 'hidden' }}>
                                                <Icon svg={<JsonIcon />} fill='green700' size='2xl' mr={2} /> {name}
                                            </LayoutBox>
                                        </td>
                                        <td>{name}</td>
                                        <td css={styles.actionsColumn}>
                                            <Button variant='tertiary' onClick={() => handleRemoveFile(name)}>
                                                Remove
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
            )}
            {actions && (
                <LayoutBox display='flex' justifyContent='flex-end' mt={10}>
                    {actions({ fileList })}
                </LayoutBox>
            )}
        </div>
    );
};

FileSelector.defaultProps = {
    fileTypes: ['json'],
    maxFileSize: 10000000,
    noFilesMessage: 'No files have been uploaded',
    multiple: false,
};

export default FileSelector;
