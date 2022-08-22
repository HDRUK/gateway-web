/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useCallback, useRef, useState } from 'react';
import { filesize } from 'humanize';
import { Box, Button, Caption, H5 } from 'hdruk-react-core';
import * as styles from './FileSelector.styles';
import Icon from '../Icon';

import { ReactComponent as UploadIcon } from '../../images/icons/upload.svg';
import { ReactComponent as RemoveIcon } from '../../images/icons/close.svg';
import { ReactComponent as JsonIcon } from '../../images/icons/json.svg';

const FileSelector = ({ children, fileTypes, maxFileSize, noFilesMessage, multiple, actions, disabled }) => {
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

    const reset = useCallback(() => {
        if (fileRef.current) fileRef.current.value = '';

        setFileList([]);
    }, [fileRef.current]);

    const readAsText = useCallback(async file => {
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        return new Promise((resolve, reject) => {
            reader.onload = e => {
                try {
                    resolve(e.target.result);
                } catch (err) {
                    reject(err);
                }
            };
        });
    }, []);

    return (
        <div css={styles.root}>
            <input type='file' ref={fileRef} accept={`.${fileTypes.join(', .')}`} onChange={handleFileChange} multiple={multiple} />
            <Box display='flex' alignItems='center' mb={10}>
                <Button
                    variant='tertiary'
                    mr={3}
                    onClick={handleSelectClick}
                    iconLeft={<Icon svg={<UploadIcon />} fill='purple500' size='lg' />}
                    disabled={disabled}
                    width='170px'>
                    Select file
                </Button>
                <div>
                    <div>
                        <Caption color='grey600'>File type(s): {fileTypes.join(', ').replace(/,([^,]*)$/, ' and $1')}</Caption>
                    </div>
                    <div>
                        <Caption color='grey600'>Max size: {filesize(maxFileSize, 1000, 0)} per file</Caption>
                    </div>
                </div>
            </Box>
            {!fileList.length && (
                <Box display='flex' justifyContent='center'>
                    <Caption>{noFilesMessage}</Caption>
                </Box>
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
                                            <Box display='flex' alignItems='center' style={{ width: '100px', overflow: 'hidden' }}>
                                                <Icon svg={<JsonIcon />} fill='green700' size='2xl' mr={2} /> {name}
                                            </Box>
                                        </td>
                                        <td>{name}</td>
                                        <td css={styles.actionsColumn}>
                                            <Button
                                                variant='tertiary'
                                                onClick={() => handleRemoveFile(name)}
                                                iconLeft={<Icon svg={<RemoveIcon />} fill='purple500' size='sm' />}>
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
            {actions && !!fileList.length && (
                <Box display='flex' justifyContent='flex-end' mt={3}>
                    {actions({ fileList, readAsText, reset })}
                </Box>
            )}
        </div>
    );
};

FileSelector.defaultProps = {
    fileTypes: ['json'],
    maxFileSize: 10000000,
    noFilesMessage: null,
    multiple: false,
};

export default FileSelector;
