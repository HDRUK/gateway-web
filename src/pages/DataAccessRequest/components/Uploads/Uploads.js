import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import FormData from 'form-data';
import { t } from 'i18next';
import { filesize } from 'humanize';
import { ReactComponent as UploadSVG } from '../../../../images/upload.svg';
import { fileStatus } from './files.util';
import { baseURL } from '../../../../configs/url.config';
import Typography from '../../../../components/Typography';
import './Uploads.scss';
import UploadFiles from './UploadFiles';
import AllFiles from './AllFiles';
import NoFiles from './NoFiles';
import Button from '../../../../components/Button';
import Icon from '../../../../components/Icon';
import useRetry from './useRetry';

const Uploads = ({ id, files, onFilesUpdate, readOnly, description, header, disabled }) => {
    const maxSize = 10485760;
    const maxRetries = 30;

    const [uploadFiles, setUploadFiles] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const onRemoveFile = file => {
        const newFiles = [...uploadFiles].filter(f => {
            return f.fileId !== file.fileId;
        });
        setUploadFiles(newFiles);
    };

    const onDeleteFile = file => {
        const newUpladedFiles = [...files].filter(f => {
            return f.fileId !== file.fileId;
        });
        onFilesUpdate(newUpladedFiles, true);
    };

    const onDropAccepted = acceptedFiles => {
        const formattedFiles = formatFiles(acceptedFiles);
        setUploadFiles(uploadFiles => [...uploadFiles, ...formattedFiles]);
    };

    const onDropRejected = rejectedFiles => {
        const rejected = formatRejectedFiles(rejectedFiles);
        const newFiles = [...uploadFiles, ...rejected];
        setUploadFiles(newFiles);
    };

    const formatFiles = acceptedFiles => {
        if (!_.isEmpty(acceptedFiles)) {
            return [...acceptedFiles].map(file => {
                return {
                    error: '',
                    fileId: uuidv4(),
                    description: '',
                    size: file.size,
                    name: file.path,
                    status: fileStatus.NEWFILE,
                    file: Object.assign(file),
                };
            });
        }
        return [];
    };

    const formatRejectedFiles = rejectedFiles => {
        if (!_.isEmpty(rejectedFiles)) {
            return [...rejectedFiles].map(f => {
                const { file, errors } = f;
                const type = errors.find(({ code }) => code === 'file-invalid-type') ? 'file-invalid-type' : errors[0].code;

                return {
                    error: t(`DAR.upload.${type}`, { size: filesize(maxSize).replace('.00', '') }),
                    fileId: uuidv4(),
                    description: '',
                    size: file.size,
                    name: file.path,
                    status: fileStatus.ERROR,
                    file: '',
                };
            });
        }
        return [];
    };

    const onDescriptionChange = event => {
        event.preventDefault();
        const { name, value } = event.currentTarget;
        const [, uniqueId = ''] = name.split('_');
        if (!_.isEmpty(uniqueId)) {
            const allFiles = [...uploadFiles].map(file => {
                if (file.fileId === uniqueId) return Object.assign(file, { ...file, description: value });

                return file;
            });
            setUploadFiles(allFiles);
        }
    };

    const onUploadFiles = async () => {
        setSubmitted(true);

        const acceptedFiles = [...uploadFiles].filter(f => !_.isEmpty(f.description) && f.status === fileStatus.NEWFILE);

        if (!_.isEmpty(acceptedFiles)) {
            const formData = new FormData();
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };

            setLoading(true);

            await axios
                .post(`${baseURL}/api/v1/data-access-request/${id}/upload`, formData, config)
                .then(response => {
                    // set submission false
                    setSubmitted(false);
                    const {
                        data: { mediaFiles = [] },
                    } = response;
                    // update file state
                    if (!_.isEmpty(mediaFiles)) {
                        // returned files and initialFilesLoad = false
                        onFilesUpdate(mediaFiles, false);
                        // wipe upload false
                        setUploadFiles([]);
                        // set loading false
                        setLoading(false);
                    }
                })
                .catch(err => {
                    setLoading(false);
                    console.error(err.message);
                });
        }
    };

    const downloadFile = async file => {
        if (!_.isEmpty(file)) {
            const { fileId, name } = file;
            await axios
                .get(`${baseURL}/api/v1/data-access-request/${id}/file/${fileId}`, { responseType: 'blob' })
                .then(response => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    // must be the file name ie me.jpeg, my.pdf
                    link.setAttribute('download', name);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch(err => {
                    console.error(err.message);
                });
        }
    };

    const deleteFile = async file => {
        if (!_.isEmpty(file)) {
            const { fileId } = file;
            const body = {
                fileId,
            };
            await axios
                .put(`${baseURL}/api/v1/data-access-request/${id}/deletefile`, body)
                .then(response => {
                    onDeleteFile(file);
                })
                .catch(err => {
                    console.error(err.message);
                });
        }
    };

    const retry = useRetry(30);

    useEffect(() => {
        retry.init([({ fileId }) => axios.get(`${baseURL}/api/v1/data-access-request/${id}/file/${fileId}`)]);
    }, []);

    // dropzone setup
    const { getRootProps, getInputProps } = useDropzone({
        noDrop: true,
        onDropAccepted,
        onDropRejected,
        minSize: 0,
        maxSize,
        accept: [
            '.pdf',
            '.doc',
            '.docx',
            '.ppt',
            '.pptx',
            '.xls',
            '.xlsx',
            '.key',
            '.pages',
            '.numbers',
            '.png',
            '.jpg',
            '.jpeg',
            '.csv',
            '.txt',
        ],
    });
    return (
        <div className='files dar-form'>
            <div className='files-header'>
                {description && <h3>{description}</h3>}
                {header && <h4>{header}</h4>}
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className='upload'>
                        <Button variant='tertiary' iconLeft={<Icon svg={<UploadSVG />} size='lg' />} disabled={disabled} mr={3}>
                            Select files
                        </Button>
                        <span className='gray700-alt-13'>
                            PDF, CSV, TXT, Powerpoint, Word, Excel, Keynote, Pages, Numbers, JPG or PNG.
                            <br />
                            Max 10MB per file.
                        </span>
                    </div>
                </div>
            </div>
            <div className='files-area'>
                {uploadFiles.length === 0 && files.length === 0 && <NoFiles />}
                {uploadFiles.length > 0 && (
                    <UploadFiles
                        uploadFiles={uploadFiles}
                        submitted={submitted}
                        isLoading={isLoading}
                        onUploadFiles={onUploadFiles}
                        onRemoveFile={onRemoveFile}
                        onDescriptionChange={onDescriptionChange}
                    />
                )}
                {files.length > 0 && <AllFiles files={files} downloadFile={downloadFile} deleteFile={deleteFile} readOnly={readOnly} />}
            </div>
        </div>
    );
};

export default Uploads;
