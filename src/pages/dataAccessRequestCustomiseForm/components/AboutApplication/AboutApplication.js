import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Accordion, Card, OverlayTrigger } from 'react-bootstrap';
import DarHelper from '../../../../utils/DarHelper.util';
import SVGIcon from '../../../../images/SVGIcon';
import { ReactComponent as InfoSVG } from '../../../../images/info.svg';
import TypeaheadDataset from '../TypeaheadDataset/TypeaheadDataset';
import AlertBox from '../AlertBox/AlertBox';
import moment from 'moment';

const AboutApplication = props => {
	let {
		key,
		activeAccordionCard,
		allowedNavigation,
		userType,
		toggleCard,
		toggleDrawer,
		onHandleDataSetChange,
		selectedDatasets,
		readOnly = false,
		onNextStep,
		projectNameValid = true,
		projectName = '',
		onHandleProjectNameBlur,
		onHandleProjectNameChange,
		onHandleProjectIsNCSToggle,
		onHandleNCSProjectChange,
		renderTooltip,
		nationalCoreStudiesProjects,
		ncsValid = true,
		toggleModal,
		completedReadAdvice = false,
		completedCommunicateAdvice = false,
		completedApprovalsAdvice = false,
		completedSubmitAdvice = false,
		completedInviteCollaborators = false,
		completedDatasetSelection = false,
		isNationalCoreStudies = false,
		nationalCoreStudiesProjectId,
		toggleMrcModal,
		toggleContributorModal,
		context,
		areDatasetsAmended = false,
		datasetsAmendedDate= ''
	} = props;

	const datasetsAmendedMessage = `Applicant has requested this as an amendment to the approved application on ${moment(datasetsAmendedDate).format('Do MMM YYYY')}`;
	
	return (
		<div className='aboutAccordion'>
			<Accordion defaultActiveKey='0' activeKey={activeAccordionCard.toString()}>
				<Card className={activeAccordionCard === 0 ? 'activeCard' : ''}>
					<Accordion.Toggle
						as={Card.Header}
						className={DarHelper.calcAccordionClasses(activeAccordionCard === 0, allowedNavigation)}
						eventKey='0'
						onClick={e => toggleCard(e, 0)}>
						{completedDatasetSelection ? (
							<div className='stepNumber completed'>
								<SVGIcon name='check' width={24} height={24} fill={'#ffffff'} />
							</div>
						) : (
							<div className={`stepNumber ${activeAccordionCard === 0 ? 'active' : ''}`}>1</div>
						)}
						Select the datasets you need
					</Accordion.Toggle>
					<Accordion.Collapse eventKey='0'>
						<Card.Body className='gray800-14'>
							<div className='margin-bottom-16'>
								The datasets you select may impact the questions being asked in this application form. You cannot change this later. If
								you’re not sure,{' '}
								<Link
									id='messageLink'
									className={allowedNavigation && userType.toUpperCase() !== 'CUSTODIAN' ? '' : 'disabled'}
									onClick={e => toggleDrawer()}>
									send a message to the data custodian
								</Link>{' '}
								to clarify. The custodian will help you understand if the data you would like to access can be used to answer your research
								question. Below you can include datasets that are listed in the Gateway. Please note that you will be able to add datasets
								not currently listed in the Gateway under the ‘Safe people’ section of this form. If you need to request access to datasets
								from multiple data custodians please contact the custodians using the messaging function before completing the application
								form.
							</div>
							<div>
								<span>Datasets</span>
								<div className='form-group'>
									<TypeaheadDataset
										key={key}
										selectedDatasets={selectedDatasets}
										onHandleDataSetChange={e => onHandleDataSetChange(e)}
										readOnly={readOnly}
										allowAllCustodians={false}
									/>
								</div>
								{_.isEmpty(selectedDatasets) ? <div className='errorMessages'>You must select at least one dataset</div> : null}
								<div className='panConfirm d-flex justify-content-end'>
									{userType.toUpperCase() === 'APPLICANT' && !readOnly && (
										<button
											type='input'
											className={`button-primary ${allowedNavigation ? '' : 'disabled'}`}
											disabled={!allowedNavigation}
											onClick={e => {
												onNextStep(allowedNavigation);
											}}>
											Confirm
										</button>
									)}
								</div>
							</div>
							{ areDatasetsAmended && <AlertBox text={datasetsAmendedMessage} status='WARNING'/>}
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card className={activeAccordionCard === 1 ? 'activeCard' : ''}>
					<Accordion.Toggle
						as={Card.Header}
						className={DarHelper.calcAccordionClasses(activeAccordionCard === 1, allowedNavigation)}
						eventKey='1'
						onClick={e => toggleCard(e, 1)}>
						{projectNameValid && ncsValid && !_.isEmpty(projectName) ? (
							<div className='stepNumber completed'>
								<SVGIcon name='check' width={24} height={24} fill={'#ffffff'} />
							</div>
						) : (
							<div className={`stepNumber ${activeAccordionCard === 0 ? 'active' : ''}`}>2</div>
						)}
						Name your application
					</Accordion.Toggle>
					<Accordion.Collapse eventKey='1'>
						<Card.Body className='gray800-14'>
							<div className='margin-bottom-16'>
								This can be your project name or anything that helps the custodian identify your application.
							</div>
							<div>
								<span>Application title</span>
								<div className='form-group'>
									<input
										className={`form-control ${!projectNameValid && _.isEmpty(projectName) ? 'emptyFormInput' : ''}`}
										name='projectName'
										onBlur={e => onHandleProjectNameBlur()}
										onChange={e => onHandleProjectNameChange(e.target.value)}
										value={projectName}
										disabled={readOnly}
									/>
									{!projectNameValid && _.isEmpty(projectName) ? <div className='errorMessages'>This cannot be empty</div> : null}
								</div>
								<div className='dar-form-check-group margin-top-8'>
									<input
										type='checkbox'
										id='chkNationalCoreStudies'
										checked={isNationalCoreStudies}
										className='dar-form-check'
										disabled={readOnly}
										onChange={e => onHandleProjectIsNCSToggle(e)}
									/>
									<span className='dar-form-check-label'>This application is part of a National Core Studies project</span>

									<OverlayTrigger
										placement='top'
										delay={{ show: 250, hide: 400 }}
										overlay={renderTooltip('We use this information for overall reporting on the efficiency of the programme.')}>
										<InfoSVG className='margin-left-8 pointer' />
									</OverlayTrigger>
								</div>
								{isNationalCoreStudies ? (
									<Fragment>
										<div className='margin-top-24'>
											<span>National Core Studies project</span>
											<OverlayTrigger
												placement='top'
												delay={{ show: 250, hide: 400 }}
												overlay={renderTooltip(
													'Projects must be added to the Gateway first using the appropriate tags associated with the National Core Studies.'
												)}>
												<InfoSVG className='margin-left-8 pointer' viewBox='0 0 24 16' />
											</OverlayTrigger>
										</div>
										<div className='form-group'>
											<select
												id='ddlNationalCoreStudiesProject'
												className='form-input-dropdown'
												value={nationalCoreStudiesProjectId}
												onChange={e => onHandleNCSProjectChange(e.target.value)}
												disabled={readOnly}>
												<option key='' value=''>
													Select a project
												</option>
												{nationalCoreStudiesProjects.map(item => (
													<option key={item.id} value={item.id}>
														{item.name}
													</option>
												))}
											</select>
											{!ncsValid ? <div className='errorMessages'>You must indicate a project or untick the option above</div> : null}
										</div>
									</Fragment>
								) : null}
								<div className='panConfirm d-flex justify-content-end'>
									{userType.toUpperCase() === 'APPLICANT' && !readOnly && (
										<button
											type='input'
											className={`button-primary ${allowedNavigation ? '' : 'disabled'}`}
											disabled={!allowedNavigation}
											onClick={e => onNextStep(allowedNavigation)}>
											Confirm
										</button>
									)}
								</div>
							</div>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card className={activeAccordionCard === 2 ? 'activeCard' : ''}>
					<Accordion.Toggle
						as={Card.Header}
						className={DarHelper.calcAccordionClasses(activeAccordionCard === 2, allowedNavigation)}
						eventKey='2'
						onClick={e => toggleCard(e, 2)}>
						{completedInviteCollaborators ? (
							<div className='stepNumber completed'>
								<SVGIcon name='check' width={24} height={24} fill={'#ffffff'} />
							</div>
						) : (
							<div className={`stepNumber ${activeAccordionCard === 0 ? 'active' : ''}`}>3</div>
						)}
						Invite contributors
					</Accordion.Toggle>
					<Accordion.Collapse eventKey='2'>
						<Card.Body className='gray800-14'>
							<Fragment>
								<div className='margin-bottom-16'>
									Applications are often a team effort, so you can add others to help. Contributors can exchange private notes, make edits,
									message the data custodian, invite others and submit the application. If they’re named in the application, you can fill in
									some of their details automatically. You can do this later too.
								</div>
								<div className='dar-form-check-group'>
									{userType.toUpperCase() !== 'CUSTODIAN' && !readOnly && (
										<button className='button-secondary' type='button' onClick={e => toggleContributorModal()}>
											Add contributors
										</button>
									)}
									<input
										type='checkbox'
										id='chkInviteContributors'
										checked={completedInviteCollaborators}
										className='dar-form-check'
										disabled={readOnly}
										onChange={e => onNextStep(e.target.checked)}
									/>
									<span className='dar-form-check-label'>I have completed this step</span>
								</div>
							</Fragment>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card className={activeAccordionCard === 3 ? 'activeCard' : ''}>
					<Accordion.Toggle
						as={Card.Header}
						className={DarHelper.calcAccordionClasses(activeAccordionCard === 3, allowedNavigation)}
						eventKey='3'
						onClick={e => toggleCard(e, 3)}>
						{completedReadAdvice ? (
							<div className='stepNumber completed'>
								<SVGIcon name='check' width={24} height={24} fill={'#ffffff'} />
							</div>
						) : (
							<div className={`stepNumber ${activeAccordionCard === 0 ? 'active' : ''}`}>4</div>
						)}
						Read the advice from the data custodian
					</Accordion.Toggle>
					<Accordion.Collapse eventKey='3'>
						<Card.Body className='gray800-14'>
							<Fragment>
								<div className='margin-bottom-16'>
									Please make sure you have read the advice provided by the data custodian on how to request access to their datasets.
								</div>
								<div className='dar-form-check-group'>
									<input
										type='checkbox'
										id='chkReadAdvice'
										checked={completedReadAdvice}
										className='dar-form-check'
										disabled={readOnly}
										onChange={e => onNextStep(e.target.checked)}
									/>
									<span className='dar-form-check-label'>
										I have read{' '}
										<Link
											id='howToRequestAccessLink'
											className={allowedNavigation && userType.toUpperCase() !== 'CUSTODIAN' ? '' : 'disabled'}
											onClick={e => {
												e.preventDefault();
												toggleModal(false, {
													...context,
													showActionButtons: false,
												})}
											}>
											how to request access
										</Link>
									</span>
								</div>
							</Fragment>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card className={activeAccordionCard === 4 ? 'activeCard' : ''}>
					<Accordion.Toggle
						as={Card.Header}
						className={DarHelper.calcAccordionClasses(activeAccordionCard === 4, allowedNavigation)}
						eventKey='4'
						onClick={e => toggleCard(e, 4)}>
						{completedCommunicateAdvice ? (
							<div className='stepNumber completed'>
								<SVGIcon name='check' width={24} height={24} fill={'#ffffff'} />
							</div>
						) : (
							<div className={`stepNumber ${activeAccordionCard === 0 ? 'active' : ''}`}>5</div>
						)}
						Communicate with the data custodian
					</Accordion.Toggle>
					<Accordion.Collapse eventKey='4'>
						<Card.Body className='gray800-14'>
							<Fragment>
								<div className='margin-bottom-16'>
									The earlier you get in touch, the better. If you've not done so yet, we recommend sending a message with a brief
									description of your project and the data you are interested in. The data custodian will help you understand the data and
									provide information on how to complete the data access application form.
								</div>
								<div className='dar-form-check-group'>
									{userType.toUpperCase() !== 'CUSTODIAN' && (
										<button className='button-secondary' type='button' onClick={e => toggleDrawer()}>
											Send message
										</button>
									)}
									<input
										type='checkbox'
										id='chkCommunicateAdvice'
										checked={completedCommunicateAdvice}
										className='dar-form-check'
										disabled={readOnly ? true : false}
										onChange={e => onNextStep(e.target.checked)}
									/>
									<span className='dar-form-check-label'>I have completed this step</span>
								</div>
							</Fragment>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card className={activeAccordionCard === 5 ? 'activeCard' : ''}>
					<Accordion.Toggle
						as={Card.Header}
						className={DarHelper.calcAccordionClasses(activeAccordionCard === 5, allowedNavigation)}
						eventKey='5'
						onClick={e => toggleCard(e, 5)}>
						{completedApprovalsAdvice ? (
							<div className='stepNumber completed'>
								<SVGIcon name='check' width={24} height={24} fill={'#ffffff'} />
							</div>
						) : (
							<div className={`stepNumber ${activeAccordionCard === 0 ? 'active' : ''}`}>6</div>
						)}
						Check what approvals you might need
					</Accordion.Toggle>
					<Accordion.Collapse eventKey='5'>
						<Card.Body className='gray800-14'>
							<Fragment>
								<div className='margin-bottom-16'>
									<p>
										Before requesting access to health data, you might need to demonstrate that everyone involved in the project has
										appropriate information governance training and / or seek approvals for research projects (e.g. ethics). For example, to
										access administrative data from custodians such as the Office for National Statistics you need to be an accredited
										researcher under the Digital Economy Act.
									</p>
									<p>
										Alternatively you might be asked to demonstrate that you have or are planning to attend recognised Information
										Governance training.
									</p>
									<p>Contact the data custodian to know more about recognised training and accreditation.</p>
									<p>
										<a
											id='approvedResearcherLink'
											target='_blank'
											rel='noopener noreferrer'
											href='https://www.ons.gov.uk/aboutus/whatwedo/statistics/requestingstatistics/approvedresearcherscheme#becoming-an-approved-researcher-through-the-ons-approved-researcher-scheme'>
											Becoming an approved researcher through the ONS approved researcher scheme
										</a>
									</p>
									<p>
										<a
											id='infoGovernanceLink'
											target='_blank'
											rel='noopener noreferrer'
											href='https://web.www.healthdatagateway.org/collection/4782731178031727'>
											Information governance training recognised by some data custodians
										</a>
									</p>
									<h2>Data Security</h2>
									<p>
										Data custodians require you to provide assurance that your organisation has appropriate data security processes in
										place. For example, use of NHS England data has to meet the standards set out in the Data Security Protection Toolkit.
										We encourage you to contact the data custodian for more information.
									</p>
									<p>
										<a id='dsptLink' target='_blank' rel='noopener noreferrer' href='https://www.dsptoolkit.nhs.uk/Account/Register'>
											DSPT
										</a>
									</p>
									<p>
										The MRC Health Data Access toolkit aims to help you understand some of the approvals required for your research project.
										Data custodians request that these approvals are in place before you gain access to data.
									</p>
								</div>
								<div className='dar-form-check-group'>
									<button className='button-secondary' type='button' onClick={e => toggleMrcModal()}>
										MRC Health Data Access toolkit
									</button>
									<input
										type='checkbox'
										id='chkApprovalAdvice'
										checked={completedApprovalsAdvice}
										className='dar-form-check'
										disabled={readOnly ? true : false}
										onChange={e => onNextStep(e.target.checked)}
									/>
									<span className='dar-form-check-label'>I have completed this step</span>
								</div>
							</Fragment>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card className={activeAccordionCard === 6 ? 'activeCard' : ''}>
					<Accordion.Toggle
						as={Card.Header}
						className={DarHelper.calcAccordionClasses(activeAccordionCard === 6, allowedNavigation)}
						eventKey='6'
						onClick={e => toggleCard(e, 6)}>
						{completedSubmitAdvice ? (
							<div className='stepNumber completed'>
								<SVGIcon name='check' width={24} height={24} fill={'#ffffff'} />
							</div>
						) : (
							<div className={`stepNumber ${activeAccordionCard === 0 ? 'active' : ''}`}>7</div>
						)}
						Understand what happens after you submit the application
					</Accordion.Toggle>
					<Accordion.Collapse eventKey='6'>
						<Card.Body className='gray800-14'>
							<Fragment>
								<div className='margin-bottom-16'>After you have completed the form, you can submit the application.</div>
								<div className='margin-bottom-16'>
									<ul>
										<li>Make sure to double-check everything before submitting.</li>
										<li>
											You will be able to edit your responses via the Gateway after submission, but please speak to the data custodian
											before making any updates as this could impact the time it takes to review your application.
										</li>
										<li>Both you and the data custodian will receive an email with a copy of the information submitted using this form.</li>
										<li>Once you have submitted, the data custodian might still ask for some additional information.</li>
									</ul>
								</div>
								<div className='dar-form-check-group'>
									<input
										type='checkbox'
										id='chkSubmitAdvice'
										checked={completedSubmitAdvice}
										className='dar-form-check'
										disabled={readOnly ? true : false}
										onChange={e => onNextStep(e.target.checked)}
									/>
									<span className='dar-form-check-label'>I have completed this step</span>
								</div>
							</Fragment>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>
		</div>
	);
};

export default AboutApplication;
