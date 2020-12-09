import React from 'react';
import { Col, Row } from 'react-bootstrap';
import './CollectionCard.scss';

class CollectionCard extends React.Component {
	state = {
		data: [],
		datasetCount: 0,
		projectCount: 0,
		paperCount: 0,
		toolCount: 0,
		courseCount: 0,
	};

	constructor(props) {
		super(props);
		this.state.data = props.data;
	}

	async componentWillMount() {
		await this.getCounts();
	}

	getCounts = async () => {
		let tempDatasetCount = this.state.datasetCount;
		let tempProjectCount = this.state.projectCount;
		let tempPaperCount = this.state.paperCount;
		let tempToolCount = this.state.toolCount;
		let tempCourseCount = this.state.courseCount;

		for (let relatedObject in this.props.data.relatedObjects) {
			switch (this.props.data.relatedObjects[relatedObject].objectType) {
				case 'dataset':
					tempDatasetCount++;
					this.setState({ datasetCount: tempDatasetCount });
					break;
				case 'project':
					tempProjectCount++;
					this.setState({ projectCount: tempProjectCount });
					break;
				case 'paper':
					tempPaperCount++;
					this.setState({ paperCount: tempPaperCount });
					break;
				case 'tool':
					tempToolCount++;
					this.setState({ toolCount: tempToolCount });
					break;
				case 'course':
					tempCourseCount++;
					this.setState({ courseCount: tempCourseCount });
					break;
			}
		}
	};

	render() {
		const { data, datasetCount, projectCount, paperCount, toolCount, courseCount } = this.state;

		let people = '';

		data.persons.map((person, key) => {
			people = people + (key !== 0 ? ', ' : '') + person.firstname + ' ' + person.lastname;
		});

		return (
			<div className='collectionCardHolder'>
				<div className='collectionBackgroundCard'>
					<div className='collectionCard'>
						<div className='collectionCardHeader'>
							<Row className='noMargin pad-bottom-4'>
								<a style={{ cursor: 'pointer' }} href={'/collection/' + data.id}>
									<span class='black-16'>{data.name.length <= 40 ? data.name : data.name.slice(0, 40) + '...'}</span>
								</a>
							</Row>

							<Row className='noMargin'>
								<span className='gray800-14'>{people.length <= 40 ? people : people.slice(0, 40) + '...'}</span>
							</Row>
						</div>

						<Col className='collectionCountsBanner gray700-13'>
							{datasetCount} {datasetCount === 1 ? ' dataset, ' : ' datasets, '}
							{projectCount} {projectCount === 1 ? ' project, ' : ' projects, '}
							{paperCount} {paperCount === 1 ? ' paper, ' : ' papers, '}
							{toolCount} {toolCount === 1 ? ' tool, ' : ' tools, '}
							{courseCount} {courseCount === 1 ? ' course' : ' courses'}
						</Col>

						{!data.imageLink || data.imageLink === 'https://' ? (
							<div id='defaultCollectionCardImage' className='margin-right-1' />
						) : (
							<img src={data.imageLink} alt='collectionLogo' id='collectionCardImage' className='margin-right-1' />
						)}

						<div className='collectionCardFooter'>
							<Row className='noMargin'>
								<span class='gray-deep-14'>
									{' '}
									{data.description.length <= 132 ? data.description : data.description.slice(0, 132) + '...'}{' '}
								</span>
							</Row>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default CollectionCard;
