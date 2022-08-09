import { find, isEmpty, isUndefined, some } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NotificationManager } from 'react-notifications';
import { Link, useHistory } from 'react-router-dom';
import { SlideDown } from 'react-slidedown';
import readXlsxFile from 'read-excel-file';
import convertToJson from 'read-excel-file/schema';
import Alert from '../../../components/Alert';
import Loading from '../../../components/Loading';
import SVGIcon from '../../../images/SVGIcon';
import dataUseRegistersService from '../../../services/data-use-registers';
import googleAnalytics from '../../../tracking';
import ActionBar from '../../commonComponents/actionbar/ActionBar';
import dataUseSchema from './DataUseSchema';
import DataUseSubmitModal from './DataUseSubmitModal';
import './DataUseUpload.scss';
import DataUseUploadActionButtons from './DataUseUploadActionButtons';

const DataUseUpload = ({ onSubmit, team, dataUsePage, userState }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const hiddenFileInput = React.useRef(null);
    const maxSize = 10485760;
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
    const [alert, setAlert] = useState('');
    const [uploadedData, setUploadedData] = useState({ rows: [], uploadErrors: [], checks: [] });
    const [dataUseRegisterIndexes, setdataUseRegisterIndexes] = useState([]);
    const [recommendedFieldsMissing, setRecommendedFieldsMissing] = useState(false);
    const [showEmptyError, setShowEmptyError] = useState(false);
    const [showSubmit, setShowSubmit] = React.useState(true);

    const dataUseRegistersUpload = dataUseRegistersService.usePostDataUseRegisterUpload(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const dataUseRegisterCheck = dataUseRegistersService.usePostDataUseRegisterCheck(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const handleShowSubmitModal = () => {
        setIsSubmitModalVisible(true);
    };

    const handleAnalytics = (label, value) => {
        googleAnalytics.recordEvent('Data uses', label, value);
    };

    const handleDownloadTemplate = () => {
        handleAnalytics('Clicked download data use template', 'DataUseUploadTemplate.xlsx');
    };

    const handleUploadFileClick = () => {
        handleAnalytics('Clicked select data uses to upload', 'File');

        hiddenFileInput.current.click();
    };

    const onUploadDataUseRegister = event => {
        if (maxSize < event.target.files[0].size) {
            setUploadedData({ uploadErrors: [{ error: 'fileSizeError' }] });
        } else {
            setIsLoading(true);
            readXlsxFile(event.target.files[0], { sheet: 'Data Uses Template' })
                .then(spreadsheet => {
                    spreadsheet.shift();
                    const { rows, errors } = convertToJson(spreadsheet, dataUseSchema);
                    if (rows.length === 0) {
                        setUploadedData({ uploadErrors: [{ error: 'noEntries' }] });
                    } else {
                        checkDataUses(rows).then(checks => {
                            const duplicateErrors = searchForDuplicates(checks);
                            rows.forEach((row, index) => {
                                rows.forEach((duplicateRow, duplicateIndex) => {
                                    if (index !== duplicateIndex) {
                                        if (
                                            row.projectIdText === duplicateRow.projectIdText ||
                                            (row.projectTitle === duplicateRow.projectTitle &&
                                                row.datasetTitles === duplicateRow.datasetTitles &&
                                                Date.parse(row.latestApprovalDate) === Date.parse(duplicateRow.latestApprovalDate))
                                        ) {
                                            if (!duplicateErrors.filter(error => error.row === duplicateIndex + 1).length > 0) {
                                                duplicateErrors.push({
                                                    row: index + 1,
                                                    duplicateRow: duplicateIndex + 1,
                                                    error: 'duplicateRow',
                                                });
                                            }
                                        }
                                    }
                                    row.latestApprovalDate = row.latestApprovalDate || new Date();
                                });
                            });

                            const uploadErrors = [...duplicateErrors, ...errors];
                            setUploadedData({ rows, uploadErrors, checks });

                            if (isEmpty(uploadErrors)) {
                                showAlert(t('datause.upload.successfulCheck'));
                            }
                            setShowSubmit(true);
                            setIsLoading(false);
                        });
                    }
                })
                .catch(err => {
                    setIsLoading(false);
                    setUploadedData({ uploadErrors: [{ error: 'errorLoading' }] });
                });
        }
        event.target.value = null;
    };

    useEffect(() => {
        if (!isEmpty(uploadedData.rows)) {
            setShowEmptyError(false);
            const uploadedRows = uploadedData.rows;
            uploadedRows.forEach(row => {
                if (
                    isEmpty(row.laySummary) ||
                    isEmpty(row.publicBenefitStatement) ||
                    isUndefined(row.latestApprovalDate) ||
                    isEmpty(row.accessType)
                ) {
                    setRecommendedFieldsMissing(true);
                    return;
                }
                setRecommendedFieldsMissing(false);
            });
        } else {
            setShowEmptyError(true);
            setIsLoading(false);
        }
    }, [uploadedData]);

    const submitDataUse = () => {
        setIsSubmitModalVisible(false);
        setSubmitted(true);
        setIsLoading(true);

        const payload = {
            teamId: team,
            dataUses: uploadedData.rows,
        };

        dataUseRegistersUpload.mutateAsync(payload).then(() => {
            setIsSubmitModalVisible(false);
            setSubmitted(false);
            setIsLoading(false);
            setShowSubmit(false);

            if (onSubmit) onSubmit();

            history.push({
                pathname: '/account',
                search: '?tab=datause',
                state: {
                    alert: {
                        message: `Pending approval. ${t('datause.upload.SuccessfulUpload')}`,
                    },
                },
            });
        });
    };

    const checkDataUses = async rows => {
        const response = await dataUseRegisterCheck.mutateAsync({
            teamId: team,
            dataUses: rows,
        });
        return response.data.result;
    };

    const toggleSubmitModal = () => {
        setIsSubmitModalVisible(!isSubmitModalVisible);
    };

    const showAlert = data => {
        setAlert(data);
    };

    const searchForDuplicates = checks => {
        const duplicateErrors = [];
        checks.forEach((check, index) => {
            if (check.isDuplicated) {
                duplicateErrors.push({ row: index + 1, error: 'duplicate' });
            }
        });
        return duplicateErrors;
    };

    const renderUploadError = error => {
        switch (error.error) {
            case 'required': {
                return <div>{t('datause.upload.requiredError', { row: error.row, column: error.column })}</div>;
            }
            case 'duplicate': {
                return <div>{t('datause.upload.duplicateError', { row: error.row })}</div>;
            }
            case 'duplicateRow': {
                return <div>{t('datause.upload.duplicateRowError', { row: error.row, duplicateRow: error.duplicateRow })}</div>;
            }
            default: {
                return '';
            }
        }
    };

    const hasDuplicates = () => !!uploadedData.uploadErrors.find(({ error }) => error === 'duplicate' || error === 'duplicateRow');

    const toggleDataUseSection = dataUseRegisterIndex => {
        const newArray = dataUseRegisterIndexes.includes(dataUseRegisterIndex)
            ? dataUseRegisterIndexes.filter(index => index !== dataUseRegisterIndex)
            : [...dataUseRegisterIndexes, dataUseRegisterIndex];

        setdataUseRegisterIndexes(newArray);
    };

    const renderApplicants = dataUse => {
        const dataUseCheck = findDataUseCheck(dataUse);
        const gatewayApplicantsLinks = dataUseCheck.gatewayApplicants.map(gatewayApplicant => (
            <div>
                <Link className='data-use-link' to={`/person/${gatewayApplicant.id}`} target='_blank'>
                    {`${gatewayApplicant.firstname}  ${gatewayApplicant.lastname}`}
                </Link>
            </div>
        ));

        const namedApplicants = dataUseCheck.nonGatewayApplicants.map(nonGatewayApplicant => <div>{nonGatewayApplicant}</div>);

        return [...gatewayApplicantsLinks, ...namedApplicants];
    };

    const renderDatasets = dataUse => {
        const dataUseCheck = findDataUseCheck(dataUse);
        const linkedDatasets = dataUseCheck.linkedDatasets.map(linkedDataset => (
            <div>
                <Link className='data-use-link' to={`/dataset/${linkedDataset.pid}`} target='_blank'>
                    {linkedDataset.name}{' '}
                </Link>
            </div>
        ));

        const namedDatasets = dataUseCheck.namedDatasets.map(namedDataset => (
            <div className='data-use-namedDataset'>
                <OverlayTrigger placement='top' overlay={<Tooltip>This dataset is not linked on the Gateway</Tooltip>}>
                    <div>
                        <SVGIcon name='attention' width={22} height={22} fill='#f0bb24' viewBox='0 -3 22 22' />
                    </div>
                </OverlayTrigger>{' '}
                {namedDataset}
            </div>
        ));

        return [...linkedDatasets, ...namedDatasets];
    };

    const renderOutputs = dataUse => {
        const dataUseCheck = findDataUseCheck(dataUse);
        const gatewayOutputsTools = dataUseCheck.gatewayOutputsTools.map(gatewayOutputsTool => (
            <div>
                <Link className='data-use-link' to={`/tool/${gatewayOutputsTool.id}`} target='_blank'>
                    {gatewayOutputsTool.name}{' '}
                </Link>
            </div>
        ));

        const gatewayOutputsPapers = dataUseCheck.gatewayOutputsPapers.map(gatewayOutputsPaper => (
            <div>
                <Link className='data-use-link' to={`/paper/${gatewayOutputsPaper.id}`} target='_blank'>
                    {gatewayOutputsPaper.name}{' '}
                </Link>
            </div>
        ));

        const nonGatewayOutputs = dataUseCheck.nonGatewayOutputs.map(nonGatewayOutput => (
            <div>
                <Link className='data-use-link' to={nonGatewayOutput} target='_blank'>
                    {nonGatewayOutput}{' '}
                </Link>
            </div>
        ));

        return [...gatewayOutputsTools, ...gatewayOutputsPapers, ...nonGatewayOutputs];
    };

    const findDataUseCheck = dataUse => {
        const dataUseCheck = uploadedData.checks.find(
            el =>
                el.projectIdText === dataUse.projectIdText ||
                (el.projectTitle === dataUse.projectTitle &&
                    el.organisationName === dataUse.organisationName &&
                    el.datasetTitles === dataUse.datasetTitles)
        );

        return dataUseCheck;
    };

    const handleAlertClose = () => {
        setAlert('');
    };

    return (
        <Row>
            <Col xs={1} />
            {submitted ? (
                isLoading && (
                    <div className='layoutCard p-4'>
                        <Loading text={t('datause.upload.loadingtext')} timeout={5000} />
                    </div>
                )
            ) : (
                <Col>
                    {!isEmpty(alert) && (
                        <Alert variant='success' dismissable onClose={handleAlertClose}>
                            {alert}
                        </Alert>
                    )}
                    <div className='layoutCard p-4'>
                        <p className='black-20-semibold mb-2'>{t('datause.upload.downloadTemplate')}</p>

                        <p className='dataUseSubHeader mb-4'>{t('datause.upload.downloadTemplateSubText')}</p>

                        <button className='button-tertiary' type>
                            <Link
                                style={{ color: '#29235c' }}
                                to='/DataUseUploadTemplate.xlsx'
                                download
                                target='_blank'
                                onClick={handleDownloadTemplate}>
                                {t('datause.upload.downloadTemplateButtonTxt')}
                            </Link>{' '}
                        </button>
                    </div>
                    <div className={isLoading ? 'layoutCard p-4 opacity' : 'layoutCard p-4'}>
                        <>
                            <div>
                                <input
                                    type='file'
                                    id='input'
                                    accept='.xls,.xlsx'
                                    hidden
                                    ref={hiddenFileInput}
                                    onChange={onUploadDataUseRegister}
                                />
                                <p className='black-20-semibold margin-bottom-16'>Upload</p>
                                <div className='upload mb-3'>
                                    <button className='button-tertiary ' onClick={handleUploadFileClick}>
                                        {t('datause.upload.selectFile')}
                                    </button>
                                    <span className='gray700-alt-13'>{t('datause.upload.fileType')}</span>
                                </div>
                            </div>
                            {!isEmpty(uploadedData.uploadErrors) && uploadedData.uploadErrors[0].error === 'fileSizeError' && (
                                <Alert variant='danger' dismissable>
                                    {t('datause.upload.fileSizeLimit')}
                                </Alert>
                            )}
                            {!isEmpty(uploadedData.uploadErrors) && uploadedData.uploadErrors[0].error === 'noEntries' && (
                                <Alert variant='danger' dismissable>
                                    {t('datause.upload.emptyError')}
                                </Alert>
                            )}
                            {!isEmpty(uploadedData.uploadErrors) && uploadedData.uploadErrors[0].error === 'errorLoading' && (
                                <Alert variant='danger' dismissable>
                                    {t('datause.upload.errorLoading')}
                                </Alert>
                            )}
                            {!isEmpty(uploadedData.uploadErrors) &&
                                uploadedData.uploadErrors[0].error !== 'fileSizeError' &&
                                uploadedData.uploadErrors[0].error !== 'noEntries' &&
                                uploadedData.uploadErrors[0].error !== 'errorLoading' && (
                                    <Alert variant='danger' dismissable>
                                        {t('datause.upload.errors')}
                                    </Alert>
                                )}
                            {!isEmpty(uploadedData.rows) && isEmpty(uploadedData.uploadErrors) && (
                                <Alert variant='danger' dismissable>
                                    {t('datause.upload.warning')}
                                </Alert>
                            )}
                        </>
                    </div>
                    {isLoading && (
                        <div className='layoutCard p-4'>
                            <Loading text={t('datause.upload.loadingtext')} timeout={5000} />
                        </div>
                    )}

                    {!isEmpty(uploadedData.rows) ? (
                        <div className='layoutCard p-4'>
                            {showEmptyError ? (
                                <Alert variant='danger' dismissable>
                                    {t('datause.upload.loadingtext')}
                                </Alert>
                            ) : (
                                ''
                            )}
                            {isEmpty(uploadedData.uploadErrors) ? (
                                <div className='black-20-semibold uploadDataTitle'>Upload Data</div>
                            ) : (
                                <>
                                    <p className='dark-red-semibold-20'>Upload Data Errors</p>
                                    <Alert variant='danger' dismissable>
                                        {uploadedData.uploadErrors.map(error => renderUploadError(error))}
                                    </Alert>
                                </>
                            )}

                            <div className='dataUseGrid'>
                                <div className='gray800-14-bold dataUseGridItem'>Project title</div>
                                <div className='gray800-14-bold dataUseGridItem'>Dataset(s)</div>
                                <div className='gray800-14-bold dataUseGridItem'>Organisation</div>
                                <div className='gray800-14-bold dataUseGridItem'>Approval date</div>

                                {uploadedData.rows.map((data, index) => {
                                    const filtered = uploadedData.uploadErrors.filter(dat => dat.row === index + 1);
                                    return (
                                        <>
                                            <div
                                                className={
                                                    some(filtered, ['error', 'duplicate'])
                                                        ? 'invalid-info dataUseGridItem duplicate-data-use'
                                                        : some(filtered, ['column', 'Project title*'])
                                                        ? 'invalid-info dataUseGridItem soft-black-14'
                                                        : 'dataUseGridItem soft-black-14'
                                                }
                                                onClick={() => toggleDataUseSection(index)}>
                                                <SVGIcon
                                                    name='chevronbottom'
                                                    width={16}
                                                    height={16}
                                                    fill='#3c4e8c'
                                                    className={!dataUseRegisterIndexes.includes(index) ? 'mr-3' : 'flip180 mr-3'}
                                                />
                                                {some(filtered, ['column', 'Project title*'])
                                                    ? find(filtered, ['column', 'Project title*']).value
                                                    : data.projectTitle}
                                            </div>
                                            <div
                                                className={
                                                    some(filtered, ['error', 'duplicate'])
                                                        ? 'invalid-info dataUseGridItem duplicate-data-use'
                                                        : some(filtered, ['column', 'Dataset(s) name*'])
                                                        ? 'invalid-info dataUseGridItem soft-black-14'
                                                        : 'dataUseGridItem soft-black-14'
                                                }
                                                onClick={() => toggleDataUseSection(index)}>
                                                {some(filtered, ['column', 'Dataset(s) name*'])
                                                    ? find(filtered, ['column', 'Dataset(s) name*']).value
                                                    : renderDatasets(data)}
                                            </div>
                                            <div
                                                className={
                                                    some(filtered, ['error', 'duplicate'])
                                                        ? 'invalid-info dataUseGridItem duplicate-data-use'
                                                        : some(filtered, ['column', 'Organisation name*'])
                                                        ? 'invalid-info dataUseGridItem soft-black-14'
                                                        : 'dataUseGridItem soft-black-14'
                                                }
                                                onClick={() => toggleDataUseSection(index)}>
                                                {some(filtered, ['column', 'Organisation name*'])
                                                    ? find(filtered, ['column', 'Organisation name*']).value
                                                    : data.organisationName}
                                            </div>
                                            <div
                                                className={
                                                    some(filtered, ['error', 'duplicate'])
                                                        ? 'invalid-info dataUseGridItem duplicate-data-use'
                                                        : some(filtered, ['column', 'Latest approval date*'])
                                                        ? 'invalid-info dataUseGridItem soft-black-14'
                                                        : 'dataUseGridItem soft-black-14'
                                                }
                                                onClick={() => toggleDataUseSection(index)}>
                                                {some(filtered, ['column', 'Latest approval date*'])
                                                    ? find(filtered, ['column', 'Latest approval date*']).value
                                                    : moment(data.latestApprovalDate).format('DD/MM/YY')}
                                            </div>

                                            <SlideDown className='dataUseDetails' closed={!dataUseRegisterIndexes.includes(index)}>
                                                <div className='dataUseDetailsGrid'>
                                                    <div className='gray800-14-bold dataUseDetailsGridSection'>Safe people</div>
                                                    <div className='dataUseDetailsGridHeader'>Project ID</div>
                                                    <div className='dataUseDetailsGridItem'>{data.projectIdText}</div>

                                                    <div className='dataUseDetailsGridHeader'>Organisation name</div>
                                                    <div
                                                        className={
                                                            some(filtered, ['column', 'Organisation name*'])
                                                                ? 'invalid-info dataUseDetailsGridItem'
                                                                : 'dataUseDetailsGridItem'
                                                        }>
                                                        {some(filtered, ['column', 'Organisation name*'])
                                                            ? find(filtered, ['column', 'Organisation name*']).value
                                                            : data.organisationName}
                                                    </div>
                                                    <div className='dataUseDetailsGridHeader'>Organisation ID</div>
                                                    <div className='dataUseDetailsGridItem'>{data.organisationId}</div>

                                                    <div className='dataUseDetailsGridHeader'>Organisation sector</div>
                                                    <div className='dataUseDetailsGridItem'>{data.organisationSector}</div>

                                                    <div className='dataUseDetailsGridHeader'>Applicant name(s)</div>
                                                    <div className='dataUseDetailsGridItem'>{renderApplicants(data)}</div>

                                                    <div className='dataUseDetailsGridHeader'>Applicant ID</div>
                                                    <div className='dataUseDetailsGridItem'>{data.applicantId}</div>

                                                    <div className='dataUseDetailsGridHeader'>Funders/ Sponsors</div>
                                                    <div className='dataUseDetailsGridItem'>{data.fundersAndSponsors}</div>
                                                    <div className='dataUseDetailsGridHeader'>Accredited researcher status</div>
                                                    <div className='dataUseDetailsGridItem'>{data.accreditedResearcherStatus}</div>
                                                    <div className='dataUseDetailsGridHeader'>Sub-licence arrangements</div>
                                                    <div className='dataUseDetailsGridItem'>{data.sublicenceArrangements}</div>

                                                    <div className='gray800-14-bold dataUseDetailsGridSection'>Safe Project</div>
                                                    <div className='dataUseDetailsGridHeader'>Project title</div>
                                                    <div
                                                        className={
                                                            some(filtered, ['column', 'Project title*'])
                                                                ? 'invalid-info dataUseDetailsGridItem'
                                                                : 'dataUseDetailsGridItem'
                                                        }>
                                                        {some(filtered, ['column', 'Project title*'])
                                                            ? find(filtered, ['column', 'Project title*']).value
                                                            : data.projectTitle}
                                                    </div>
                                                    <div className='dataUseDetailsGridHeader'>Lay Summary</div>
                                                    <div
                                                        className={
                                                            some(filtered, ['column', 'Lay summary*'])
                                                                ? 'invalid-info dataUseDetailsGridItem'
                                                                : 'dataUseDetailsGridItem'
                                                        }>
                                                        {some(filtered, ['column', 'Lay summary*'])
                                                            ? find(filtered, ['column', 'Lay summary*']).value
                                                            : data.laySummary}
                                                    </div>
                                                    <div className='dataUseDetailsGridHeader'>Public benefit statement</div>
                                                    <div className='dataUseDetailsGridItem'>{data.publicBenefitStatement}</div>
                                                    <div className='dataUseDetailsGridHeader'>Request category type</div>
                                                    <div className='dataUseDetailsGridItem'>{data.requestCategoryType}</div>
                                                    <div className='dataUseDetailsGridHeader'>Technical summary</div>
                                                    <div className='dataUseDetailsGridItem'>{data.technicalSummary}</div>
                                                    <div className='dataUseDetailsGridHeader'>Other approval committees</div>
                                                    <div className='dataUseDetailsGridItem'>{data.otherApprovalCommittees}</div>
                                                    <div className='dataUseDetailsGridHeader'>Project start date</div>
                                                    <div className='dataUseDetailsGridItem'>
                                                        {data.projectStartDate ? moment(data.projectStartDate).format('DD/MM/YY') : ''}
                                                    </div>
                                                    <div className='dataUseDetailsGridHeader'>Project end date</div>
                                                    <div className='dataUseDetailsGridItem'>
                                                        {data.projectEndDate ? moment(data.projectEndDate).format('DD/MM/YY') : ''}
                                                    </div>
                                                    <div className='dataUseDetailsGridHeader'>Latest approval date</div>
                                                    <div
                                                        className={
                                                            some(filtered, ['column', 'Latest approval date*'])
                                                                ? 'invalid-info dataUseDetailsGridItem'
                                                                : 'dataUseDetailsGridItem '
                                                        }
                                                        onClick={() => toggleDataUseSection(index)}>
                                                        {some(filtered, ['column', 'Latest approval date*'])
                                                            ? find(filtered, ['column', 'Latest approval date*']).value
                                                            : data.latestApprovalDate
                                                            ? moment(data.latestApprovalDate).format('DD/MM/YY')
                                                            : ''}
                                                    </div>

                                                    <div className='gray800-14-bold dataUseDetailsGridSection'>Safe data</div>
                                                    <div className='dataUseDetailsGridHeader'>Dataset(s) name</div>
                                                    <div
                                                        className={
                                                            some(filtered, ['column', 'Dataset(s) name*'])
                                                                ? 'invalid-info dataUseDetailsGridItem '
                                                                : 'dataUseDetailsGridItem'
                                                        }>
                                                        {some(filtered, ['column', 'Dataset(s) name*'])
                                                            ? find(filtered, ['column', 'Dataset(s) name*']).value
                                                            : renderDatasets(data)}
                                                    </div>
                                                    <div className='dataUseDetailsGridHeader'>Data sensitivity level</div>
                                                    <div className='dataUseDetailsGridItem'>{data.dataSensitivityLevel}</div>
                                                    <div className='dataUseDetailsGridHeader'>
                                                        Legal basis for provision of data under Article 6
                                                    </div>
                                                    <div className='dataUseDetailsGridItem'>{data.legalBasisForDataArticle6}</div>
                                                    <div className='dataUseDetailsGridHeader'>
                                                        Lawful conditions for provision of data under Article 9
                                                    </div>
                                                    <div className='dataUseDetailsGridItem'>{data.legalBasisForDataArticle9}</div>
                                                    <div className='dataUseDetailsGridHeader'>Common law duty of confidentiality</div>
                                                    <div className='dataUseDetailsGridItem'>{data.dutyOfConfidentiality}</div>
                                                    <div className='dataUseDetailsGridHeader'>National data opt-out applied?</div>
                                                    <div className='dataUseDetailsGridItem'>{data.nationalDataOptOut}</div>
                                                    <div className='dataUseDetailsGridHeader'>Request frequency</div>
                                                    <div className='dataUseDetailsGridItem'>{data.requestFrequency}</div>
                                                    <div className='dataUseDetailsGridHeader'>
                                                        For linked datasets, specify how the linkage will take place
                                                    </div>
                                                    <div className='dataUseDetailsGridItem'>{data.datasetLinkageDescription}</div>
                                                    <div className='dataUseDetailsGridHeader'>
                                                        Description of the confidential data being used
                                                    </div>
                                                    <div className='dataUseDetailsGridItem'>{data.confidentialDataDescription}</div>
                                                    <div className='dataUseDetailsGridHeader'>Release/Access Date</div>
                                                    <div className='dataUseDetailsGridItem'>
                                                        {data.accessDate ? moment(data.accessDate).format('DD/MM/YY') : ''}
                                                    </div>

                                                    <div className='gray800-14-bold dataUseDetailsGridSection'>Safe Settings</div>
                                                    <div className='dataUseDetailsGridHeader'>Access type</div>
                                                    <div
                                                        className={
                                                            some(filtered, ['column', 'Access type*'])
                                                                ? 'invalid-info dataUseDetailsGridItem'
                                                                : 'dataUseDetailsGridItem '
                                                        }
                                                        onClick={() => toggleDataUseSection(index)}>
                                                        {some(filtered, ['column', 'Access type*'])
                                                            ? find(filtered, ['column', 'Access type*']).value
                                                            : data.accessType}
                                                    </div>
                                                    <div className='dataUseDetailsGridHeader'>
                                                        How has data been processed to enhance privacy?
                                                    </div>
                                                    <div className='dataUseDetailsGridItem'>{data.privacyEnhancements}</div>

                                                    <div className='gray800-14-bold dataUseDetailsGridSection'>Safe Outputs</div>
                                                    <div className='dataUseDetailsGridHeader'>Link to research outputs</div>
                                                    <div className='dataUseDetailsGridItem'>{renderOutputs(data)}</div>
                                                </div>
                                            </SlideDown>
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        ''
                    )}

                    <DataUseSubmitModal
                        open={isSubmitModalVisible}
                        close={toggleSubmitModal}
                        confirm={submitDataUse}
                        isValid={isEmpty(uploadedData.uploadErrors)}
                        hasDuplicates={hasDuplicates()}
                        isAdmin={userState[0].teams.some(team => team.type === 'admin')}
                        recommendedFieldsMissing={recommendedFieldsMissing}
                    />

                    {showSubmit && (
                        <ActionBar userState={userState}>
                            <div className='action-bar'>
                                <div className='action-bar-actions'>
                                    <DataUseUploadActionButtons onSubmit={handleShowSubmitModal} />
                                </div>
                            </div>
                        </ActionBar>
                    )}
                </Col>
            )}
            <Col xs={1} />
        </Row>
    );
};

export default DataUseUpload;
