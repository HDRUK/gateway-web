import React, { Fragment } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import WorkflowObject from './WorkflowObject';

const WorkflowsModal = ({ workflows, toggleSelected }) => {
	return (
		<Fragment>
			<div className='relatedModalBackground'>
				<Container>
					<Row>
						<Col sm={1} lg={1} />
						<Col sm={10} lg={10} className='mt-2 mb-3'>
							<Row>
								{workflows.map((workflow, i) => {
									return <WorkflowObject key={`workflow-${i}`} workflow={workflow} toggleSelected={toggleSelected} />;
								})}
							</Row>
							<Row>
								<div style={{ height: '50px' }}></div>
							</Row>
						</Col>
					</Row>
				</Container>
			</div>
		</Fragment>
	);
};

export default WorkflowsModal;
