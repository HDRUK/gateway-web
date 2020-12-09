import React from 'react';
import { Col, Row, Accordion, Card, Button } from 'react-bootstrap';
import './Dashboard.scss';

class AccountDatasets extends React.Component {
	// initialize our state
	state = {
		userState: [],
		activeAccordionCard: 0,
	};

	constructor(props) {
		super(props);
		this.state.userState = props.userState;
	}

	toggleCard = (e, eventKey) => {
		e.preventDefault();
		// 1. Deconstruct current state
		let { activeAccordionCard } = this.state;

		if (activeAccordionCard === eventKey) {
			eventKey = -1;
		}

		// 2. Set new state
		this.setState({
			activeAccordionCard: eventKey,
		});
	};

	render() {
		const { activeAccordionCard } = this.state;

		return (
			<div>
				<Row className='pixelGapBottom'>
					<Col sm={1} lg={1} />
					<Col sm={10} lg={10}>
						<div className='rectangle'>
							<p className='black-20-semibold margin-bottom-8'>Datasets</p>
							<p className='gray800-15 margin-bottom-6'>
								The Health Data Research Innovation Gateway does not hold patient data, only information about the datasets (metadata).
								Adding new datasets or managing existing ones can be done via the metadata onboarding platform.
							</p>
						</div>
					</Col>
					<Col sm={1} lg={1} />
				</Row>

				<Row>
					<Col sm={1} lg={1} />
					<Col sm={10} lg={10}>
						<Accordion defaultActiveKey='0' activeKey={activeAccordionCard.toString()}>
							<Card className={activeAccordionCard === 0 ? 'activeCard datasetCard' : 'datasetCard'}>
								<Accordion.Toggle as={Card.Header} eventKey='0' onClick={e => this.toggleCard(e, 0)} className='datasetCard'>
									<div className={activeAccordionCard === 0 ? 'stepNumber active' : 'stepNumber'}>1</div>
									<span className='black-16 noTextDecoration'>Adding new datasets</span>
								</Accordion.Toggle>
								<Accordion.Collapse eventKey='0'>
									<Card.Body className='datasetCard gray800-14'>
										<ul className='gray800-14'>
											<li>
												If you have an account on the{' '}
												<a href='https://hdruk-auth.metadata.works/auth' rel='noopener noreferrer' className='purple-14'>
													HDR UK Onboarding Platform (HOP)
												</a>
												, you can access the metadata onboarding platform using the button below
											</li>
											<li>
												If you do have an account on HOP, please request it by submitting a request{' '}
												<a
													href='https://metadata.atlassian.net/servicedesk/customer/portal/4/group/8/create/56'
													rel='noopener noreferrer'
													target='_blank'
													className='purple-14'>
													here
												</a>
												.
											</li>
											<li>Use your Innovation Gateway credentials to log in</li>

											<li>You’ll be asked to provide details about the datasets, ranging from basic to technical details</li>
											<li>You can save your progress and continue later</li>
											<li>
												The more information you add, the easier it will be for applicants to understand if your dataset fits their needs
											</li>
											<li>Anyone is welcome to add information about open datasets, even if they’re not the data custodian</li>
											<li>All datasets will be reviewed and approved before going live</li>
										</ul>
									</Card.Body>
								</Accordion.Collapse>
							</Card>
							<Card className={activeAccordionCard === 1 ? 'activeCard datasetCard' : 'datasetCard'}>
								<Accordion.Toggle as={Card.Header} eventKey='1' onClick={e => this.toggleCard(e, 1)} className='datasetCard'>
									<div className={activeAccordionCard === 1 ? 'stepNumber active' : 'stepNumber'}>2</div>
									<span className='black-16 noTextDecoration'>Managing datasets</span>
								</Accordion.Toggle>
								<Accordion.Collapse eventKey='1'>
									<Card.Body className='datasetCard gray800-14'>
										<ul className='gray800-14'>
											<li>You can access the metadata onboarding platform using the button below</li>
											<li>Use your Innovation Gateway credentials to login</li>
											<li>Edit or add more information about your datasets</li>
											<li>You can save your progress and publish later</li>
											<li>All datasets will be reviewed and approved before going live</li>
										</ul>
									</Card.Body>
								</Accordion.Collapse>
							</Card>
							<Card className={activeAccordionCard === 2 ? 'activeCard datasetCard' : 'datasetCard'}>
								<Accordion.Toggle as={Card.Header} eventKey='2' onClick={e => this.toggleCard(e, 2)} className='datasetCard'>
									<div className={activeAccordionCard === 2 ? 'stepNumber active' : 'stepNumber'}>3</div>
									<span className='black-16 noTextDecoration'>Help and support</span>
								</Accordion.Toggle>
								<Accordion.Collapse eventKey='2'>
									<Card.Body className='datasetCard gray800-14'>
										<ul className='gray800-14'>
											<li>The User Guide contains how-to guides, descriptions and examples for each data field</li>
											<li>If you cannot find the information you need in the User Guide, please submit a ticket using the Service Desk</li>
											<li>Both can be accessed using the buttons below</li>
											<li>
												If you already had an account, you’ll need to be granted access again. If you have any issues, please submit a
												ticket using the Service Desk
											</li>
										</ul>
									</Card.Body>
								</Accordion.Collapse>
							</Card>
						</Accordion>

						<div className='rectangle text-right'>
							<Button
								variant='medium'
								href='https://metadata.atlassian.net/servicedesk/customer/portal/4'
								target='_blank'
								id='serviceDeskButton'
								className='dark-14 margin-right-8'
								data-testid='servicedesk-button'>
								Service desk
							</Button>

							<Button
								variant='medium'
								href='https://metadata.atlassian.net/wiki/spaces/HDR/overview'
								target='_blank'
								id='userguideButton'
								className='dark-14 margin-right-8'
								data-testid='userguide-button'>
								User guide
							</Button>

							<Button
								variant='primary'
								href='https://hdruk-preprod-auth.metadata.works/auth'
								id='metadataButton'
								className='white-14-semibold'>
								Access the metadata onboarding platform
							</Button>
						</div>
					</Col>
					<Col sm={1} lg={1} />
				</Row>
			</div>
		);
	}
}

export default AccountDatasets;
