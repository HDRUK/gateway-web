import React, { useState } from 'react';
import { Container, Row, Col, Button, OverlayTrigger } from 'react-bootstrap';
import moment from 'moment';
import SVGIcon from '../../../images/SVGIcon';

const About = ({ data, renderTooltip }) => {
	const [closedLaySummary, setClosedLaySummary] = useState(true);
	const [closedPublicBenefit, setClosedPublicBenefit] = useState(true);
	const [closedDataUse, setClosedDataUse] = useState(true);
	const [hide, setHide] = useState(true);

	let count =
		Object.keys(data).length === 0
			? data &&
			  data.reduce(function recur(sum, obj) {
					return sum + (obj === '' || (Object(obj) === obj && Object.values(obj).reduce(recur, 0)));
			  }, 0)
			: 0;

	return (
		<>
			<>
				<Container className='datause-card datause-safeInfo'>
					<p className='black-14-bold'>Safe people</p>

					<Row className='soft-black-14 datause-view-grid '>
						<Col md={4}>Organisation name</Col>
						<OverlayTrigger
							placement='top'
							overlay={renderTooltip('The name of the legal entity that signs the contract to access the data.')}>
							<button className='datause-info-icon-button'>
								<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
							</button>
						</OverlayTrigger>
						<Col md={7}>
							{data.organisationName.length > 0 ? (
								<p>
									<a href={'/search?search=&tab=Datauses&datauseorganisationname=' + data.organisationName}>
										<span className='badge-tag badge-datause-bold'>{data.organisationName}</span>
									</a>
								</p>
							) : (
								<p className='gray800-14-opacity'>Not specified</p>
							)}
						</Col>
					</Row>

					{!data.organisationId > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Organisation ID</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip(
									'A unique identifier for an organisation that is preferably an industry used standard such as Grid.ac (see https://www.grid.ac/institutes)'
								)}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col>
								{data.organisationId && data.organisationId.length > 0 ? (
									data.organisationId
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					{!data.organisationSector > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Organisation sector</Col>
							<OverlayTrigger placement='top' overlay={renderTooltip('Sector which the applicant(s) work falls under.')}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.organisationSector && data.organisationSector.length > 0 ? (
									<a href={'/search?search=&tab=Datauses&datauserganisationsector=' + data.organisationSector}>
										<span className='badge-tag badge-datause-bold'>{data.organisationSector}</span>
									</a>
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					{(!data.gatewayApplicants || data.gatewayApplicants.length === 0) &&
					(!data.nonGatewayApplicants || data.nonGatewayApplicants.length === 0) &&
					hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Applicant name(s)</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip(
									'The name of the Principal Investigator, as well as any other individuals that have been authorised to use the data.'
								)}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{(data.gatewayApplicants && data.gatewayApplicants.length > 0) ||
								(data.nonGatewayApplicants && data.nonGatewayApplicants.length > 0) ? (
									<>
										{data &&
											data.gatewayApplicants.map(gatewayApplicant => (
												<span className='hdruser badge-tag'>
													<span className='datatuse-personicon-bg'>
														<SVGIcon name='personiconwithbg' width={17} height={16} fill={'#3db28c'} />
													</span>
													<a href={`/person/${gatewayApplicant.id}`} className='soft-black-14 badge-datause-bold'>
														{' '}
														{gatewayApplicant.firstname} {gatewayApplicant.lastname}
													</a>
												</span>
											))}
										{data &&
											data.nonGatewayApplicants.map(nonGatewayApplicant => (
												<span className='nonhdruser badge-datause-bold badge-tag'>{nonGatewayApplicant}</span>
											))}
									</>
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					{!data.applicantId > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Applicant ID</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip(
									'A unique identifier for the applicant that is preferably an industry used standard such as Grid.ac (see https://www.grid.ac/)'
								)}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.applicantId && data.applicantId.length > 0 ? data.applicantId : <p className='gray800-14-opacity'>Not specified</p>}
							</Col>
						</Row>
					)}
					{data.fundersAndSponsors && data.fundersAndSponsors.length === 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Funders/Sponsor</Col>
							<OverlayTrigger placement='top' overlay={renderTooltip('The name of any funders or sponsors involved in the project.')}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={6}>
								{data.fundersAndSponsors.length > 0 ? (
									data.fundersAndSponsors.map(a => (
										<a href={'/search?search=&tab=Datauses&datausefundersandsponsors=' + a}>
											<span className='badge-tag badge-datause-bold'>{a}</span>
										</a>
									))
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					{!data.accreditedResearcherStatus > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>DEA accredited researcher status</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip(
									'The accreditation status of the Principal Investigator/applicant, as defined by the ONS Research Code of Practice and Accreditation criteria. '
								)}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.accreditedResearcherStatus && data.accreditedResearcherStatus.length > 0 ? (
									data.accreditedResearcherStatus
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					{!data.sublicenceArrangements > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Sub-licence arrangements (if any)?</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip(
									'Identifies whether there are any permissions for the applicant to share the data beyond the named parties.'
								)}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.sublicenceArrangements && data.sublicenceArrangements.length > 0 ? (
									data.sublicenceArrangements
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
				</Container>
				<Container className='datause-card datause-safeInfo'>
					<p className='black-14-bold'>Safe projects</p>
					{!data.projectIdText > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Project ID</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip(
									'A unique identifier for the project that is preferably an industry used standard, such as IRAS ID. However for non-research projects, a unique reference number created by the data custodian on receipt of the application is sufficient.'
								)}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={6}>
								{data.projectIdText && data.projectIdText.length > 0 ? (
									data.projectIdText
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}

					<Row className='soft-black-14 datause-view-grid'>
						<Col md={4}>Project title</Col>
						<OverlayTrigger
							placement='top'
							overlay={renderTooltip(
								'The title of the project/research study/request that the applicant is investigating through the use of health data.'
							)}>
							<button className='datause-info-icon-button'>
								<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
							</button>
						</OverlayTrigger>
						<Col md={7}>
							{data.projectTitle && data.projectTitle.length > 0 ? data.projectTitle : <p className='gray800-14-opacity'>Not specified</p>}
						</Col>
					</Row>

					<Row className='soft-black-14 datause-view-grid'>
						<Col md={4}>
							Lay summary
							{data.laySummary.length >= 250 ? (
								<button
									className='datause-arrow'
									onClick={() => (!closedLaySummary ? setClosedLaySummary(true) : setClosedLaySummary(false))}>
									<SVGIcon width='20px' height='20px' name='chevronbottom' fill={'#475da7'} className={closedLaySummary ? '' : 'flip180'} />
								</button>
							) : (
								''
							)}
						</Col>
						<OverlayTrigger
							placement='top'
							overlay={renderTooltip(
								'A concise and clear description of the project, (e.g. as required by URKI in funding applications). It should outline the problem, objectives and expected outcomes in language that is understandable to the general public and contain a maximum of 300 words.'
							)}>
							<button className='datause-info-icon-button'>
								<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
							</button>
						</OverlayTrigger>
						<Col md={7}>
							{data.laySummary.length > 0 ? (
								closedLaySummary ? (
									<>
										{data.laySummary.substr(0, 250)}
										{data.laySummary.length >= 250 ? '...' : ''}
									</>
								) : (
									data.laySummary
								)
							) : (
								<p className='gray800-14-opacity'>Not specified</p>
							)}
						</Col>
					</Row>

					<Row className='soft-black-14 datause-view-grid'>
						<Col md={4}>
							Public benefit statement
							{data.publicBenefitStatement.length >= 250 ? (
								<button
									className='datause-arrow'
									onClick={() => (!closedPublicBenefit ? setClosedPublicBenefit(true) : setClosedPublicBenefit(false))}>
									<SVGIcon
										width='20px'
										height='20px'
										name='chevronbottom'
										fill={'#475da7'}
										className={closedPublicBenefit ? '' : 'flip180'}
									/>
								</button>
							) : (
								''
							)}
						</Col>
						<OverlayTrigger
							placement='top'
							overlay={renderTooltip(
								'A description in plain English of the anticipated outcomes, or impact of project on the general public.'
							)}>
							<button className='datause-info-icon-button'>
								<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
							</button>
						</OverlayTrigger>
						<Col md={7}>
							{data.publicBenefitStatement && data.publicBenefitStatement.length > 0 ? (
								closedPublicBenefit ? (
									<>
										{data.publicBenefitStatement.substr(0, 250)}
										{data.publicBenefitStatement.length >= 250 ? '...' : ''}
									</>
								) : (
									data.publicBenefitStatement
								)
							) : (
								<p className='gray800-14-opacity'>Not specified</p>
							)}
						</Col>
					</Row>

					{!data.requestCategoryType && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Request category type</Col>
							<OverlayTrigger placement='top' overlay={renderTooltip('This categorises the main purpose of the data being shared.')}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.requestCategoryType && data.requestCategoryType.length > 0 ? (
									data.requestCategoryType
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					{!data.technicalSummary && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Technical summary</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip('A summary of the proposed research, in a manner that is suitable for a specialist reader.')}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.technicalSummary && data.technicalSummary.length > 0 ? (
									data.technicalSummary
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					{!data.otherApprovalCommittees && data.otherApprovalCommittees.length === 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Other approval committees</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip('Reference to other decision-making bodies that the project has already been authorised by.')}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.otherApprovalCommittees && data.otherApprovalCommittees.length > 0 ? (
									data.otherApprovalCommittees
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					{!data.projectStartDate > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Project start date</Col>
							<OverlayTrigger placement='top' overlay={renderTooltip('The date the project is scheduled to start or actual start date.')}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={6}>
								{data.projectStartDate && data.projectStartDate.length > 0 ? (
									moment(data.projectStartDate).format('YYYY-MM-DD')
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					{!data.projectEndDate > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Project end date</Col>
							<OverlayTrigger placement='top' overlay={renderTooltip('The date the project is scheduled to finish or actual end date.')}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.projectEndDate && data.projectEndDate.length > 0 ? (
									moment(data.projectEndDate).format('YYYY-MM-DD')
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					<Row className='soft-black-14 datause-view-grid'>
						<Col md={4}>Latest approval date</Col>
						<OverlayTrigger
							placement='top'
							overlay={renderTooltip('The last date the data access request for this project was approved by a data custodian.')}>
							<button className='datause-info-icon-button'>
								<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
							</button>
						</OverlayTrigger>
						<Col md={7}>
							{data.latestApprovalDate && data.latestApprovalDate.length > 0 ? (
								moment(data.latestApprovalDate).format('YYYY-MM-DD')
							) : (
								<p className='gray800-14-opacity'>Not specified</p>
							)}
						</Col>
					</Row>
				</Container>
				<Container className='datause-card datause-view-grid datause-safeInfo'>
					<p className='black-14-bold'>Safe data</p>
					<Row className='soft-black-14 datause-view-grid'>
						<Col md={4}>Dataset(s) name</Col>
						<OverlayTrigger placement='top' overlay={renderTooltip('The name of the dataset(s) being accessed.')}>
							<button className='datause-info-icon-button'>
								<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
							</button>
						</OverlayTrigger>
						<Col md={7}>
							{(data.gatewayDatasetsInfo && data.gatewayDatasetsInfo.length > 0) ||
							(data.nonGatewayDatasets && data.nonGatewayDatasets.length > 0) ? (
								<>
									{data &&
										data.gatewayDatasetsInfo.map(gatewayDataset => (
											<a href={`/dataset/${gatewayDataset.pid}`}>
												<span className='badge-tag badge-datause-bold'>{gatewayDataset.name}</span>
											</a>
										))}

									{data && data.nonGatewayDatasets.map(nonGatewayDataset => <> {nonGatewayDataset}</>)}
								</>
							) : (
								<p className='gray800-14-opacity'>Not specified</p>
							)}
						</Col>
					</Row>

					{!data.dataSensitivityLevel > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Data sensitivity level</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip(
									'The level of identifiability of the data being accessed, as defined by Understanding Patient Data. In the case of multiple datasets being accessed, the sensitivity level for the dataset with the most sensitive data should be used: Personally Identifiable > De-Personalised > Anonymous'
								)}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.dataSensitivityLevel && data.dataSensitivityLevel.length > 0 ? (
									data.dataSensitivityLevel
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					{!data.legalBasisForDataArticle6 > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Legal basis for provision of data under Article 6</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip(
									'The legal basis that allows the applicant to lawfully process personally identifiable data, as specified by NHS Digital.'
								)}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.legalBasisForDataArticle6 && data.legalBasisForDataArticle6.length > 0 ? (
									data.legalBasisForDataArticle6
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					{!data.legalBasisForDataArticle9 > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Lawful conditions for provision of data under Article 9</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip('An appropriate Article 9 condition for processing the special category data.')}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.legalBasisForDataArticle9 && data.legalBasisForDataArticle9.length > 0 ? (
									data.legalBasisForDataArticle9
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					{!data.dutyOfConfidentiality > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Common law of duty of confidentiality</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip(
									'In the application of the Common Law Duty of Confidentiality there are 2 options that enable a release: Consent (Reasonable Expectation) or Section 251 NHS Act 2006.'
								)}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.dutyOfConfidentiality && data.dutyOfConfidentiality.length > 0 ? (
									data.dutyOfConfidentiality
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					{!data.nationalDataOptOut > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>National data opt-out applied?</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip(
									'Specifies whether the preference for people to opt-out of their confidential patient information being used for secondary use has been applied to the data prior to release.'
								)}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.nationalDataOptOut && data.nationalDataOptOut.length > 0 ? (
									data.nationalDataOptOut
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					{!data.requestFrequency > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Request frequency</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip(
									'Determines whether this a "one-off" request or a recurring dataset to be provided over a specific time period.'
								)}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.requestFrequency && data.requestFrequency.length > 0 ? (
									data.requestFrequency
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					{!data.datasetLinkageDescription > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>For linked datasets, specify how the linkage will take place</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip(
									'The information relevant to data linkage, including organisations undertaking linkages and data flows.'
								)}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.datasetLinkageDescription && data.datasetLinkageDescription.length > 0 ? (
									data.datasetLinkageDescription
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
					{!data.confidentialDataDescription > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>
								Description of the confidential data being used
								{data.confidentialDataDescription && data.confidentialDataDescription.length >= 250 ? (
									<button className='datause-arrow' onClick={() => (!closedDataUse ? setClosedDataUse(true) : setClosedDataUse(false))}>
										<SVGIcon width='20px' height='20px' name='chevronbottom' fill={'#475da7'} className={closedDataUse ? '' : 'flip180'} />
									</button>
								) : (
									''
								)}
							</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip(
									'A description of the specific patient identifiable fields that have been included in the dataset(s) being accessed.'
								)}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{closedDataUse ? (
									data.confidentialDataDescription ? (
										data.confidentialDataDescription.substr(0, 150)
									) : (
										<p className='gray800-14-opacity'>Not specified</p>
									)
								) : (
									data.confidentialDataDescription
								)}
							</Col>
						</Row>
					)}
					{!data.accessDate > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>Release/Access date</Col>
							<OverlayTrigger placement='top' overlay={renderTooltip('The date the data access was granted and active research started.')}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.accessDate && data.accessDate.length > 0 ? (
									moment(data.accessDate).format('YYYY-MM-DD')
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
				</Container>
				<Container className='datause-card datause-safeInfo'>
					<p className='black-14-bold'>Safe setting</p>
					<Row className='soft-black-14 datause-view-grid'>
						<Col md={4}>Access type</Col>
						<OverlayTrigger
							placement='top'
							overlay={renderTooltip(
								'An indication of how data is accessed, whether through access to a Data Safe Haven/Trusted Research Environment or through data release in any other local environment.'
							)}>
							<button className='datause-info-icon-button'>
								<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
							</button>
						</OverlayTrigger>
						<Col md={7}>
							{data.accessType && data.accessType.length > 0 ? data.accessType : <p className='gray800-14-opacity'>Not specified</p>}
						</Col>
					</Row>

					{!data.privacyEnhancements > 0 && hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14 datause-view-grid'>
							<Col md={4}>How has data been processed to enhance privacy?</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip('Description of the tools or software used to reduce level of identifiable data being shared.')}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{data.privacyEnhancements && data.privacyEnhancements.length > 0 ? (
									data.privacyEnhancements
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
				</Container>
				<Container className='datause-card datause-safeInfo'>
					<p className='black-14-bold'>Safe output</p>
					{(!data.gatewayOutputsToolsInfo || data.gatewayOutputsToolsInfo.length === 0) &&
					(!data.gatewayOutputsPapers || data.gatewayOutputsPapers.length === 0) &&
					(!data.nonGatewayOutputs || data.nonGatewayOutputs.length === 0) &&
					hide ? (
						(() => {
							count++;
						})()
					) : (
						<Row className='soft-black-14'>
							<Col md={4}>Link to research outputs</Col>
							<OverlayTrigger
								placement='top'
								overlay={renderTooltip(
									'A URL link to any academic or non-academic research outputs, as they become available, including code used.'
								)}>
								<button className='datause-info-icon-button'>
									<SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
								</button>
							</OverlayTrigger>
							<Col md={7}>
								{(data.gatewayOutputsToolsInfo && data.gatewayOutputsToolsInfo.length > 0) ||
								(data.gatewayOutputsPapers && data.gatewayOutputsPapers.length > 0) ||
								(data.nonGatewayOutputs && data.nonGatewayOutputs.length > 0) ? (
									<>
										{data &&
											data.gatewayOutputsToolsInfo.map(gatewayOutputsTool => (
												<a href={`/tool/${gatewayOutputsTool.id}`}>
													<span className='badge-tag badge-datause-bold'>{gatewayOutputsTool.name}</span>
												</a>
											))}
										{data &&
											data.gatewayOutputsPapersInfo.map(gatewayOutputsPaper => (
												<a href={`/paper/${gatewayOutputsPaper.id}`}>
													<span className='badge-tag badge-datause-bold'>{gatewayOutputsPaper.name}</span>
												</a>
											))}

										{data &&
											data.nonGatewayOutputs.map(nonGatewayOutput => (
												<a href={nonGatewayOutput} className='purple-blue-14'>
													{nonGatewayOutput}
												</a>
											))}
									</>
								) : (
									<p className='gray800-14-opacity'>Not specified</p>
								)}
							</Col>
						</Row>
					)}
				</Container>
			</>
			<Row>
				<Col className='datause-about-info'>
					<p className='soft-black-14'>
						Data custodians are responsible for providing information about their approved data uses register. Where not all fields are
						completed, we hide empty fields to make the page easier to read, but you can choose to view them.
					</p>
				</Col>
			</Row>
			<Row className='datause-hidefields-button'>
				<Button className='datause-button' onClick={() => (hide ? setHide(false) : setHide(true))}>
					{!hide ? 'Hide all empty fields' : 'Show all empty fields (' + count + ')'}
				</Button>
			</Row>
		</>
	);
};

export default About;
