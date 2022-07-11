/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { remove } from 'lodash';
import * as styles from './FileUpload.styles';
import Button from '../Button';
import Typography, { H3, H4, H5 } from '../Typography';
import LayoutBox from '../LayoutBox';
import Icon from '../Icon';

import { ReactComponent as JsonIcon } from '../../images/icons/json.svg';

const FileUpload = ({ fileTypes, maxFileSize, messageNothingUploaded }) => {
    const fileRef = useRef(null);
    const [fileList, setFileList] = useState([]);

    const handleSelectClick = useCallback(() => {
        const { current } = fileRef;
        if (current) {
            current.click();
        }
    }, [fileRef.current]);

    const handleFileChange = useCallback(e => {
        console.log('e.target.files', e.target.files);
        setFileList(e.target.files);
    }, []);

    const handleRemoveFile = name => {
        const files = remove([...fileList], {
            name,
        });

        fileRef.current.value = '';

        setFileList(files);
    };

    // const onUploadFiles = async () => {
    //     const acceptedFiles = [...uploadFiles].filter(f => !_.isEmpty(f.description) && f.status === fileStatus.NEWFILE);

    //     if (!_.isEmpty(acceptedFiles)) {
    //         const formData = new FormData();

    //         const fileObjects = [...acceptedFiles].map(f => {
    //             const { file } = f;
    //             formData.append('assets', file);
    //             formData.append('descriptions', f.description);
    //             formData.append('ids', f.fileId);
    //         });

    //         const config = {
    //             headers: { 'Content-Type': 'multipart/form-data' },
    //         };

    //         const response = await axios.post(`${baseURL}/api/v1/data-access-request/${id}/upload`, formData, config);

    //                 setSubmitted(false);
    //                 const {
    //                     data: { mediaFiles = [] },
    //                 } = response;
    //                 // update file state
    //                 if (!_.isEmpty(mediaFiles)) {
    //                     // returned files and initialFilesLoad = false
    //                     onFilesUpdate(mediaFiles, false);
    //                     // wipe upload false
    //                     setUploadFiles([]);
    //                     // set loading false
    //                     setLoading(false);
    //                 }
    //             });
    //     }
    // };

    console.log('fileRef', fileRef.current?.files);

    return (
        <div css={styles.root}>
            <input type='file' ref={fileRef} accept={`.${fileTypes.join(', .')}`} onChange={handleFileChange} />
            <LayoutBox display='flex' alignItems='center' mb={10}>
                <Button variant='tertiary' mr={3} onClick={handleSelectClick}>
                    Select file
                </Button>
                <Typography color='grey600' variant='caption'>
                    <div>File type: {fileTypes.join(',')}</div>
                    <div>Max size: {maxFileSize} per file</div>
                </Typography>
            </LayoutBox>
            {!fileList.length && (
                <LayoutBox display='flex' justifyContent='center'>
                    <Typography variant='caption'>{messageNothingUploaded}</Typography>
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
                                            <Button variant='tertiary' onClick={name => handleRemoveFile(name)}>
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
        </div>
    );
};

FileUpload.defaultProps = {
    fileTypes: ['json'],
    maxFileSize: '10Mb',
    messageNothingUploaded: 'No files have been uploaded',
};

export default FileUpload;
