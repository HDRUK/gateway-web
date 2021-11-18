import React, { useState, useEffect } from 'react';
import readXlsxFile from 'read-excel-file';
import convertToJson from 'read-excel-file/schema';
import { Row, Col, Alert, Image, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { isEmpty, some, find, isUndefined } from 'lodash';
import axios from 'axios';
import { SlideDown } from 'react-slidedown';
import moment from 'moment';

import SVGIcon from '../../../images/SVGIcon';

import DataUseSubmitModal from './DataUseSubmitModal';
import dataUseSchema from './DataUseSchema';

import './DataUseUpload.scss';

var baseURL = require('../../commonComponents/BaseURL').getURL();

const DataUseUpload = React.forwardRef(({ onSubmit, team, dataUsePage, userState }, ref) => {
	React.useImperativeHandle(ref, () => ({
		toggleSubmitModal,
	}));

	const hiddenFileInput = React.useRef(null);
	const maxSize = 10485760;
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
	const [alert, setAlert] = useState('');
	const [uploadedData, setUploadedData] = useState({ rows: [], uploadErrors: [], checks: [] });
	const [dataUseIndexes, setDataUseIndexes] = useState([]);
	const [recommendedFieldsMissing, setRecommendedFieldsMissing] = useState(false);

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
							const uploadErrors = [...duplicateErrors, ...errors];
							setUploadedData({ rows, uploadErrors, checks });
							if (isEmpty(uploadErrors)) {
								showAlert('Your data uses have been successfully uploaded.');
							}
						});
					}
				})
				.catch(err => {
					setUploadedData({ uploadErrors: [{ error: 'errorLoading' }] });
				});
			setIsLoading(false);
		}
		event.target.value = null;
	};

	useEffect(() => {
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
	}, [uploadedData]);

	const submitDataUse = () => {
		const payload = {
			teamId: team,
			dataUses: uploadedData.rows,
		};

		axios.post(baseURL + '/api/v2/data-use-registers/upload', payload).then(res => {
			setIsSubmitModalVisible(false);
			onSubmit();
			dataUsePage.current.showAlert('Submitted! The Gateway team will process your uploaded data uses and let you know when they go live.');
		});
	};

	const checkDataUses = async rows => {
		const payload = {
			teamId: team,
			dataUses: rows,
		};

		let response = await axios.post(baseURL + '/api/v2/data-use-registers/check', payload);
		return response.data.result;
	};

	const toggleSubmitModal = () => {
		setIsSubmitModalVisible(!isSubmitModalVisible);
	};

	const showAlert = alert => {
		setAlert(alert);
		setTimeout(() => setAlert(''), 10000);
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

	const handleUploadFileClick = () => {
		hiddenFileInput.current.click();
	};

	const renderUploadError = error => {
		switch (error.error) {
			case 'required': {
				return (
					<div>
						Error in row {error.row}: Mandatory field “{error.column}” is empty
					</div>
				);
			}
			case 'duplicate': {
				return <div>Error in row {error.row} : Suspected data use duplicate</div>;
			}
			default: {
				return '';
			}
		}
	};

	const toggleDataUseSection = dataUseIndex => {
		const newArray = dataUseIndexes.includes(dataUseIndex)
			? dataUseIndexes.filter(index => index !== dataUseIndex)
			: [...dataUseIndexes, dataUseIndex];

		setDataUseIndexes(newArray);
	};

	const renderApplicants = dataUse => {
		const dataUseCheck = findDataUseCheck(dataUse);
		const gatewayApplicantsLinks = dataUseCheck.gatewayApplicants.map(gatewayApplicant => {
			return (
				<div>
					<Link className='data-use-link' to={'/person/' + gatewayApplicant.id} target='_blank'>
						{`${gatewayApplicant.firstname}  ${gatewayApplicant.lastname}`}
					</Link>
				</div>
			);
		});

		const namedApplicants = dataUseCheck.nonGatewayApplicants.map(nonGatewayApplicant => {
			return <div>{nonGatewayApplicant}</div>;
		});

		return [...gatewayApplicantsLinks, ...namedApplicants];
	};

	const renderDatasets = dataUse => {
		const dataUseCheck = findDataUseCheck(dataUse);
		const linkedDatasets = dataUseCheck.linkedDatasets.map(linkedDataset => {
			return (
				<div>
					<Link className='data-use-link' to={'/dataset/' + linkedDataset.datasetid} target='_blank'>
						{linkedDataset.name}{' '}
					</Link>
				</div>
			);
		});

		const namedDatasets = dataUseCheck.namedDatasets.map(namedDataset => {
			return (
				<div className='data-use-namedDataset'>
					<OverlayTrigger placement='top' overlay={<Tooltip>This dataset is not linked on the Gateway</Tooltip>}>
						<div>
							<SVGIcon name='attention' width={22} height={22} fill={'#f0bb24'} viewBox='0 -3 22 22' />
						</div>
					</OverlayTrigger>{' '}
					{namedDataset}
				</div>
			);
		});

		return [...linkedDatasets, ...namedDatasets];
	};

	const renderOutputs = dataUse => {
		const dataUseCheck = findDataUseCheck(dataUse);

		const gatewayOutputsTools = dataUseCheck.gatewayOutputsTools.map(gatewayOutputsTool => {
			return (
				<div>
					<Link className='data-use-link' to={'/tool/' + gatewayOutputsTool.id} target='_blank'>
						{gatewayOutputsTool.name}{' '}
					</Link>
				</div>
			);
		});

		const gatewayOutputsPapers = dataUseCheck.gatewayOutputsPapers.map(gatewayOutputsPaper => {
			return (
				<div>
					<Link className='data-use-link' to={'/paper/' + gatewayOutputsPaper.id} target='_blank'>
						{gatewayOutputsPaper.name}{' '}
					</Link>
				</div>
			);
		});

		const nonGatewayOutputs = dataUseCheck.nonGatewayOutputs.map(nonGatewayOutput => {
			return (
				<div>
					<Link className='data-use-link' to={nonGatewayOutput} target='_blank'>
						{nonGatewayOutput}{' '}
					</Link>
				</div>
			);
		});

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

	return (
		<Row>
			<Col xs={1}></Col>
			<Col>
				{!isEmpty(alert) && (
					<Alert variant={'success'} className='main-alert'>
						<SVGIcon name='check' width={24} height={24} fill={'#2C8267'} /> {alert}
					</Alert>
				)}

				<div className='layoutCard p-4'>
					<p className='black-20-semibold mb-2'>Download template</p>

					<p className='dataUseSubHeader mb-4'>
						Please use the template provided to add new approved data uses . You can also download your current data use register from the
						Gateway, edit offline and uploading the edited file here:{' '}
					</p>

					<button className='button-tertiary'>
						<Link style={{ color: '#29235c' }} to='/DataUseUploadTemplate.xlsx' download target='_blank'>
							Download the data use template
						</Link>{' '}
					</button>
				</div>
				<div className={isLoading ? 'layoutCard p-4 opacity' : 'layoutCard p-4'}>
					<>
						{isLoading && (
							<div className='dataUseLoading'>
								<Image src={require('../../../images/Loader.gif')} />
								<div className='gray800-14'>Loading...</div>
							</div>
						)}

						<div>
							<input type='file' id='input' accept='.xls,.xlsx' hidden ref={hiddenFileInput} onChange={onUploadDataUseRegister} />
							<p className='black-20-semibold margin-bottom-16'>Upload</p>
							<div className='upload mb-3'>
								<button className='button-tertiary ' onClick={handleUploadFileClick}>
									Select file...
								</button>
								<span className='gray700-alt-13'>Excel or xls. Max 10MB per file.</span>
							</div>
						</div>

						{!isEmpty(uploadedData.uploadErrors) && uploadedData.uploadErrors[0].error === 'fileSizeError' && (
							<Alert variant='danger'>File exceeds 10MB limit</Alert>
						)}
						{!isEmpty(uploadedData.uploadErrors) && uploadedData.uploadErrors[0].error === 'noEntries' && (
							<Alert variant='danger'>File contained no entries</Alert>
						)}
						{!isEmpty(uploadedData.uploadErrors) && uploadedData.uploadErrors[0].error === 'errorLoading' && (
							<Alert variant='danger'>There was an error loading the file</Alert>
						)}
						{!isEmpty(uploadedData.uploadErrors) &&
							uploadedData.uploadErrors[0].error !== 'fileSizeError' &&
							uploadedData.uploadErrors[0].error !== 'noEntries' &&
							uploadedData.uploadErrors[0].error !== 'errorLoading' && (
								<Alert variant='danger'>
									There are errors in the data you uploaded. Please correct these and try again. Errors are listed below.
								</Alert>
							)}
						{!isEmpty(uploadedData.rows) && isEmpty(uploadedData.uploadErrors) && (
							<Alert variant='warning'>
								Warning! Uploading a new file will delete any data uses that have not yet been submitted for admin checks by the gateway
								team.
							</Alert>
						)}
					</>
				</div>

				{!isEmpty(uploadedData.rows) ? (
					<div className='layoutCard p-4'>
						{isEmpty(uploadedData.uploadErrors) ? (
							<div className='black-20-semibold uploadDataTitle'>Upload Data</div>
						) : (
							<>
								<p className='dark-red-semibold-20'>Upload Data Errors</p>
								<Alert variant='danger'>{uploadedData.uploadErrors.map(error => renderUploadError(error))}</Alert>
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
												fill={'#3c4e8c'}
												className={!dataUseIndexes.includes(index) ? 'mr-3' : 'flip180 mr-3'}
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

										<SlideDown className='dataUseDetails' closed={!dataUseIndexes.includes(index)}>
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
														some(filtered, ['column', 'Project title*']) ? 'invalid-info dataUseDetailsGridItem' : 'dataUseDetailsGridItem'
													}>
													{some(filtered, ['column', 'Project title*'])
														? find(filtered, ['column', 'Project title*']).value
														: data.projectTitle}
												</div>
												<div className='dataUseDetailsGridHeader'>Lay Summary</div>
												<div
													className={
														some(filtered, ['column', 'Lay summary*']) ? 'invalid-info dataUseDetailsGridItem' : 'dataUseDetailsGridItem'
													}>
													{some(filtered, ['column', 'Lay summary*']) ? find(filtered, ['column', 'Lay summary*']).value : data.laySummary}
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
												<div className='dataUseDetailsGridHeader'>Legal basis for provision of data under Article 6</div>
												<div className='dataUseDetailsGridItem'>{data.legalBasisForDataArticle6}</div>
												<div className='dataUseDetailsGridHeader'>Lawful conditions for provision of data under Article 9</div>
												<div className='dataUseDetailsGridItem'>{data.legalBasisForDataArticle9}</div>
												<div className='dataUseDetailsGridHeader'>Common law duty of confidentiality</div>
												<div className='dataUseDetailsGridItem'>{data.dutyOfConfidentiality}</div>
												<div className='dataUseDetailsGridHeader'>National data opt-out applied?</div>
												<div className='dataUseDetailsGridItem'>{data.nationalDataOptOut}</div>
												<div className='dataUseDetailsGridHeader'>Request frequency</div>
												<div className='dataUseDetailsGridItem'>{data.requestFrequency}</div>
												<div className='dataUseDetailsGridHeader'>For linked datasets, specify how the linkage will take place</div>
												<div className='dataUseDetailsGridItem'>{data.datasetLinkageDescription}</div>
												<div className='dataUseDetailsGridHeader'>Description of the confidential data being used</div>
												<div className='dataUseDetailsGridItem'>{data.confidentialDataDescription}</div>
												<div className='dataUseDetailsGridHeader'>Release/Access Date</div>
												<div className='dataUseDetailsGridItem'>{data.accessDate ? moment(data.accessDate).format('DD/MM/YY') : ''}</div>

												<div className='gray800-14-bold dataUseDetailsGridSection'>Safe Settings</div>
												<div className='dataUseDetailsGridHeader'>Access type</div>
												<div
													className={
														some(filtered, ['column', 'Access type*']) ? 'invalid-info dataUseDetailsGridItem' : 'dataUseDetailsGridItem '
													}
													onClick={() => toggleDataUseSection(index)}>
													{some(filtered, ['column', 'Access type*']) ? find(filtered, ['column', 'Access type*']).value : data.accessType}
												</div>
												<div className='dataUseDetailsGridHeader'>How has data been processed to enhance privacy?</div>
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
					isAdmin={userState[0].teams.some(team => team.type === 'admin')}
					recommendedFieldsMissing={recommendedFieldsMissing}
				/>
			</Col>
			<Col xs={1}></Col>
		</Row>
	);
});

export default DataUseUpload;
