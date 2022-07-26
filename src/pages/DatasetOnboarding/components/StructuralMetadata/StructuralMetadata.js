import React, { useState, useEffect } from 'react';
import { isEmpty, some, find } from 'lodash';
import axios from 'axios';
import readXlsxFile from 'read-excel-file';
import { Link } from 'react-router-dom';
import { Row, Col, Alert, Table } from 'react-bootstrap';
import { ReactComponent as UploadSVG } from '../../../../images/upload.svg';
import { baseURL } from '../../../../configs/url.config';
import './StructuralMetadata.scss';
import Button from '../../../../components/Button';
import Icon from '../../../../components/Icon';

const StructuralMetadata = ({
    onStructuralMetaDataUpdate,
    structuralMetadata,
    structuralMetadataErrors,
    currentVersionId,
    readOnly,
    percentageCompleted,
}) => {
    // 10mb - 10485760
    // 2mb - 2097152
    const maxSize = 10485760;
    const [newStructuralMetaData, setNewStructuralMetaData] = useState(structuralMetadata);
    const [newStructuralMetaDataErrors, setNewStructuralMetaDataErrors] = useState(structuralMetadataErrors);
    const [showOverrideWarning, setShowOverrideWarning] = useState(!isEmpty(structuralMetadata));
    const [showSuccessfullyUploaded, setShowSuccessfullyUploaded] = useState(false);

    const schema = {
        'Table Name': {
            prop: 'tableName',
            type: value => {
                if (value.length > 255) {
                    throw new Error('tooLong255');
                }
                return value;
            },
            required: true,
        },
        'Table Description': {
            prop: 'tableDescription',
            type: value => {
                if (value.length > 20000) {
                    throw new Error('tooLong20000');
                }
                return value;
            },
        },
        'Column Name': {
            prop: 'columnName',
            type: value => {
                if (value.length > 255) {
                    throw new Error('tooLong255');
                }
                return value;
            },
            required: true,
        },
        'Column Description': {
            prop: 'columnDescription',
            type: value => {
                if (value.length > 20000) {
                    throw new Error('tooLong20000');
                }
                return value;
            },
            required: true,
        },
        'Data Type': {
            prop: 'dataType',
            type: value => {
                if (value.length > 255) {
                    throw new Error('tooLong255');
                }
                return value;
            },
            required: true,
        },
        Sensitive: {
            prop: 'sensitive',
            type: Boolean,
            required: true,
        },
    };

    const onChange = event => {
        if (maxSize < event.target.files[0].size) {
            setNewStructuralMetaDataErrors([{ error: 'fileSizeError' }]);
        } else {
            readXlsxFile(event.target.files[0], { schema })
                .then(({ rows, errors }) => {
                    if (rows.length === 0) {
                        setNewStructuralMetaDataErrors([{ error: 'noEntries' }]);
                    } else if (errors.length > 0) {
                        setNewStructuralMetaDataErrors(errors);
                    } else {
                        const listOfDuplicateRows = [];
                        rows.forEach((row, index) => {
                            const foundDuplicates = rows.filter(x => x.tableName === row.tableName && x.columnName === row.columnName);

                            if (foundDuplicates.length > 1) {
                                foundDuplicates.every(duplicate => {
                                    if (
                                        !listOfDuplicateRows.find(
                                            x => x === duplicate.tableName && x.columnName === duplicate.columnName && x.index === index
                                        )
                                    ) {
                                        listOfDuplicateRows.push({ ...duplicate, index });
                                        return false;
                                    }
                                    return true;
                                });
                            }
                        });

                        if (!isEmpty(listOfDuplicateRows)) {
                            listOfDuplicateRows.forEach(duplicate => {
                                errors.push({
                                    column: 'Column Name',
                                    error: 'duplicate',
                                    row: duplicate.index + 1,
                                    value: duplicate.columnName,
                                });
                            });
                            setNewStructuralMetaDataErrors(errors);
                        } else {
                            setNewStructuralMetaDataErrors([]);

                            percentageCompleted.structural = 100;

                            const params = {
                                rows: JSON.stringify(rows),
                                key: 'structuralMetadata',
                                percentageCompleted,
                            };
                            axios.patch(`${baseURL}/api/v1/dataset-onboarding/${currentVersionId}`, params);
                            setShowSuccessfullyUploaded(true);
                        }
                    }
                    setNewStructuralMetaData(rows);
                    setShowOverrideWarning(true);
                })
                .catch(err => {
                    setNewStructuralMetaDataErrors([{ error: 'errorLoading' }]);
                });
        }
        event.target.value = null;
    };

    useEffect(() => {
        onStructuralMetaDataUpdate(newStructuralMetaData, newStructuralMetaDataErrors);
    }, [newStructuralMetaData, newStructuralMetaDataErrors]);

    const hiddenFileInput = React.useRef(null);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const renderErrors = errors => {
        if (errors.column === 'Sensitive') {
            if (errors.error === 'required') {
                return (
                    <>
                        Error in row {errors.row}: "{errors.column}" is empty and should be "True" or "False"
                        <br />
                    </>
                );
            }
            return (
                <>
                    Error in row {errors.row}: "{errors.column}" is "{errors.value}" and should be "True" or "False"
                    <br />
                </>
            );
        }
        if (errors.error === 'tooLong20000') {
            return (
                <>
                    Error in row {errors.row}: "{errors.column}" too long at {errors.value.length} characters (only 20000 characters are
                    allowed)
                    <br />
                </>
            );
        }
        if (errors.error === 'tooLong255') {
            return (
                <>
                    Error in row {errors.row}: "{errors.column}" too long at {errors.value.length} characters (only 255 characters are
                    allowed)
                    <br />
                </>
            );
        }
        if (errors.error === 'duplicate') {
            return (
                <>
                    Error in row {errors.row}: "{errors.value}" is a duplicate column name
                    <br />
                </>
            );
        }
        return (
            <>
                Error in row {errors.row}: "{errors.column}" is empty and should have content
                <br />
            </>
        );
    };

    return (
        <div className='files'>
            <Table className='text-size-small gray-800'>
                <thead>
                    <th className='metadata-field'>Metadata field</th>
                    <th>Completion guidance</th>
                </thead>
                <tbody>
                    <tr>
                        <td>Table name*</td>
                        <td>Name of the table in the dataset. Use a fully qualified name if appropiate</td>
                    </tr>
                    <tr>
                        <td>Table description</td>
                        <td>Description of the table in the dataset</td>
                    </tr>
                    <tr>
                        <td>Column name*</td>
                        <td>Name of the column in the table dataset</td>
                    </tr>
                    <tr>
                        <td>Column description*</td>
                        <td>Decription of the column in the table content</td>
                    </tr>
                    <tr>
                        <td>Data type*</td>
                        <td>Type of data contained in the column</td>
                    </tr>
                    <tr>
                        <td>Sensitive*</td>
                        <td>
                            Please indicate (True / False) whether the information must be treated as sensitive and may need additional
                            constraints / removal / anonymisation / masking through the data access request process. Definition: An ODRL
                            conformant policy expressing the rights associated with the resource.
                        </td>
                    </tr>
                </tbody>
            </Table>
            <div>
                <button className='button-tertiary margin-top-8 margin-bottom-24'>
                    <Link to='/StructuralMetadataTemplate.xlsx' download target='_blank'>
                        Download data dictionary template
                    </Link>
                </button>
            </div>
            <div className='files-header'>
                <div>
                    <input type='file' id='input' accept='.xls,.xlsx' hidden ref={hiddenFileInput} onChange={onChange} />
                    <p className='black-20-semibold margin-bottom-16'>Upload</p>
                    <div className='upload'>
                        <Button variant='tertiary' iconLeft={<Icon svg={<UploadSVG />} size='lg' />} disabled={readOnly} mr={3}>
                            Select file
                        </Button>
                        <span className='gray700-alt-13'>Excel or xls. Max 10MB per file.</span>
                    </div>
                </div>
            </div>

            <div className='files-area'>
                {showSuccessfullyUploaded ? (
                    <Row>
                        <Col xs={12} s={12} md={12}>
                            <Alert variant='success'>Your data has been successfully uploaded.</Alert>
                        </Col>
                    </Row>
                ) : (
                    ''
                )}

                {showOverrideWarning ? (
                    <Row>
                        <Col xs={12} s={12} md={12}>
                            <Alert variant='warning'>
                                Warning! Uploading a new file will delete the previously uploaded technical metadata.
                            </Alert>
                        </Col>
                    </Row>
                ) : (
                    ''
                )}

                {structuralMetadataErrors.length > 0 ? (
                    <Row>
                        <Col xs={12} s={12} md={12}>
                            {structuralMetadataErrors[0].error === 'fileSizeError' ? (
                                <Alert variant='danger'>File exceeds 10MB limit</Alert>
                            ) : (
                                ''
                            )}
                            {structuralMetadataErrors[0].error === 'noEntries' ? (
                                <Alert variant='danger'>File contained no entries</Alert>
                            ) : (
                                ''
                            )}
                            {structuralMetadataErrors[0].error === 'errorLoading' ? (
                                <Alert variant='danger'>There was an error loading the file</Alert>
                            ) : (
                                ''
                            )}
                            {structuralMetadataErrors[0].error !== 'fileSizeError' &&
                            structuralMetadataErrors[0].error !== 'noEntries' &&
                            structuralMetadataErrors[0].error !== 'errorLoading' ? (
                                <Alert variant='danger'>
                                    There are errors in the data you uploaded. Please correct these and try again. Errors are listed below.
                                </Alert>
                            ) : (
                                ''
                            )}
                        </Col>
                    </Row>
                ) : (
                    ''
                )}

                {structuralMetadataErrors.length !== 0 &&
                structuralMetadataErrors[0].error !== 'fileSizeError' &&
                structuralMetadataErrors[0].error !== 'noEntries' &&
                structuralMetadataErrors[0].error !== 'errorLoading' ? (
                    <Row>
                        <p className='dark-red-semibold-20 margin-top-16 margin-left-8'>Uploaded data errors</p>
                        <Col xs={12} s={12} md={12}>
                            <Alert variant='danger'>
                                {structuralMetadataErrors.map(errors => {
                                    return renderErrors(errors);
                                })}
                            </Alert>
                        </Col>
                    </Row>
                ) : (
                    ''
                )}

                <Table responsive size='sm' className='margin-top-8'>
                    {structuralMetadata.length !== 0 ? (
                        <thead>
                            <tr className='gray800-14-bold'>
                                <th>Table name</th>
                                <th className='table-description'>Table description</th>
                                <th>Column name</th>
                                <th>Column description</th>
                                <th>Data type</th>
                                <th>Sensitive</th>
                            </tr>
                        </thead>
                    ) : (
                        ''
                    )}
                    <tbody>
                        {structuralMetadata.map((data, index) => {
                            const filtered = structuralMetadataErrors.filter(dat => dat.row === index + 1);

                            return (
                                <tr className='gray800-14'>
                                    <td className={some(filtered, ['column', 'Table Name']) ? 'invalid-info table-cell' : 'table-cell'}>
                                        {some(filtered, ['column', 'Table Name'])
                                            ? find(filtered, ['column', 'Table Name']).value
                                            : data.tableName}
                                    </td>
                                    <td
                                        className={
                                            some(filtered, ['column', 'Table Description']) ? 'invalid-info table-cell' : 'table-cell'
                                        }>
                                        {some(filtered, ['column', 'Table Description'])
                                            ? find(filtered, ['column', 'Table Description']).value
                                            : data.tableDescription}
                                    </td>
                                    <td className={some(filtered, ['column', 'Column Name']) ? 'invalid-info table-cell' : 'table-cell'}>
                                        {some(filtered, ['column', 'Column Name'])
                                            ? find(filtered, ['column', 'Column Name']).value
                                            : data.columnName}
                                    </td>
                                    <td
                                        className={
                                            some(filtered, ['column', 'Column Description']) ? 'invalid-info table-cell' : 'table-cell'
                                        }>
                                        {some(filtered, ['column', 'Column Description'])
                                            ? find(filtered, ['column', 'Column Description']).value
                                            : data.columnDescription}
                                    </td>
                                    <td className={some(filtered, ['column', 'Data Type']) ? 'invalid-info table-cell' : 'table-cell'}>
                                        {data.dataType}
                                    </td>
                                    <td className={some(filtered, ['column', 'Sensitive']) ? 'invalid-info table-cell' : 'table-cell'}>
                                        {some(filtered, ['column', 'Sensitive'])
                                            ? find(filtered, ['column', 'Sensitive']).value
                                            : String(data.sensitive)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default StructuralMetadata;
