import React from 'react';
import { Col, Row, Accordion, Card, Button } from 'react-bootstrap';
import './Dashboard.scss';

class AccountAdvancedSearch extends React.Component {
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
							<span className='black-20-semibold'>Advanced search</span>

							<div id='thisTag' className='margin-left-8 margin-bottom-8'>
								<span className='white-13-bold'>BETA</span>
							</div>

							<p className='gray800-15 margin-bottom-6'>
								The advanced search allows you to find datasets based on the characteristics you need for your project , such as disease,
								age, and location. This feature is still being tested, so only a limited number of datasets are available for now.
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
									<span className='black-16 noTextDecoration'>Creating a cohort</span>
								</Accordion.Toggle>
								<Accordion.Collapse eventKey='0'>
									<Card.Body className='datasetCard gray800-14'>
										<ul className='gray800-14'>
											<li>Access the advanced search tool using the button below.</li>
											<li>Select the characteristics you need for your project , such as disease, age, gender and location.</li>
											<li>Use AND/OR to specify your inclusion and exclusion criteria.</li>
											<li>
												The tool will give you a list of datasets listed on the Gateway where this data is available, including sample size.
											</li>
											<li>You can save your search and return later</li>
										</ul>
									</Card.Body>
								</Accordion.Collapse>
							</Card>
							<Card className={activeAccordionCard === 1 ? 'activeCard datasetCard' : 'datasetCard'}>
								<Accordion.Toggle as={Card.Header} eventKey='1' onClick={e => this.toggleCard(e, 1)} className='datasetCard'>
									<div className={activeAccordionCard === 1 ? 'stepNumber active' : 'stepNumber'}>2</div>
									<span className='black-16 noTextDecoration'>Requesting access</span>
								</Accordion.Toggle>
								<Accordion.Collapse eventKey='1'>
									<Card.Body className='datasetCard gray800-14'>
										<ul className='gray800-14'>
											<li>Once you have found the datasets you need, you can make a Data Access Request via the Innovation Gateway</li>
											<li>Search for the datasets on the Innovation Gateway and either make an enquiry or request acccess</li>
											<li>Data Access Requests must be made individually for each dataset</li>
										</ul>
									</Card.Body>
								</Accordion.Collapse>
							</Card>
						</Accordion>
						<div className='rectangle text-right'>
							<Button
								variant='primary'
								href='https://atlas-test.uksouth.cloudapp.azure.com/bcrquest/'
								id='advancedSearchButton'
								className='white-14-semibold margin-right-16'>
								Access the advanced search tool
							</Button>
						</div>
					</Col>
					<Col sm={1} lg={1} />
				</Row>
			</div>
		);
	}
}

export default AccountAdvancedSearch;
