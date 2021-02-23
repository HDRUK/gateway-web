import React, { Fragment } from 'react';
import { Row, Col, Tab, Tabs, Container } from 'react-bootstrap';
import _ from 'lodash';
import SimpleSearchBar from '../searchBar/SimpleSearchBar';
import RelatedObject from '../relatedObject/RelatedObject';
import './RelatedResourcesModal.scss';
import { PaginationHelper } from '../PaginationHelper';

class RelatedResourcesModal extends React.Component {
	state = {
		userState: [
			{
				loggedIn: false,
				role: 'Reader',
				id: null,
				name: null,
			},
		],
		key: '',
		summary: [],
		relatedObjectIds: [],
		relatedObjects: [],
		selected: {
			datasets: 0,
			tools: 0,
			projects: 0,
			papers: 0,
			persons: 0,
			courses: 0,
		},
		searchString: '',
		previousSearchString: '',
	};

	constructor(props) {
		super(props);
		this.state.userState = props.userState;
		this.state.relatedObjects = props.relatedObjects;
		this.state.relatedObjectIds = [];
		this.state.searchString = props.searchString;
	}

	componentDidUpdate(prevProps) {
		if (this.props.searchString !== prevProps.searchString) {
			this.setState({ searchString: this.props.searchString });
		}
		if (
			this.props.datasetData !== prevProps.datasetData ||
			this.props.toolData !== prevProps.toolData ||
			this.props.projectData !== prevProps.projectData ||
			this.props.paperData !== prevProps.paperData ||
			this.props.courseData !== prevProps.courseData ||
			this.props.personData !== prevProps.personData
		) {
			if (this.state.previousSearchString !== this.state.searchString) {
				this.setState({ previousSearchString: this.props.searchString });
				this.setDatasetPaginationIndex(0);
				this.setProjectPaginationIndex(0);
				this.setPaperPaginationIndex(0);
				this.setToolPaginationIndex(0);
				this.setCoursePaginationIndex(0);
				this.setPersonPaginationIndex(0);
			}
		}
	}

	handleSelect = key => {
		this.setState({ key: key });
	};

	setDatasetPaginationIndex = async index => {
		this.props.setDatasetPaginationIndex(index);
	};

	setProjectPaginationIndex = async index => {
		this.props.setProjectPaginationIndex(index);
	};

	setPaperPaginationIndex = async index => {
		this.props.setPaperPaginationIndex(index);
	};

	setToolPaginationIndex = async index => {
		this.props.setToolPaginationIndex(index);
	};

	setCoursePaginationIndex = async index => {
		this.props.setCoursePaginationIndex(index);
	};

	setPersonPaginationIndex = async index => {
		this.props.setPersonPaginationIndex(index);
	};

	render() {
		let { key } = this.state;

		let datasetCount = this.props.summary.datasets || 0;
		let toolCount = this.props.summary.tools || 0;
		let projectCount = this.props.summary.projects || 0;
		let paperCount = this.props.summary.papers || 0;
		let personCount = this.props.summary.persons || 0;
		let courseCount = this.props.summary.courses || 0;

		if (key === '' || typeof key === 'undefined') {
			if (datasetCount > 0) {
				key = 'Datasets';
			} else if (toolCount > 0) {
				key = 'Tools';
			} else if (projectCount > 0) {
				key = 'Projects';
			} else if (paperCount > 0) {
				key = 'Papers';
			} else if (personCount > 0) {
				key = 'People';
			} else if (courseCount > 0) {
				key = 'Course';
			} else {
				key = 'Datasets';
			}
		}
		const maxResult = 40;

		var editingObjectProject = 0;
		var editingObjectTool = 0;

		if (this.props.projectData.some(object => object.id === this.props.projectid)) {
			editingObjectProject = 1;
		}
		if (this.props.toolData.some(object => object.id === this.props.toolid)) {
			editingObjectTool = 1;
		}

		this.state.selected.datasets = 0;
		this.state.selected.tools = 0;
		this.state.selected.projects = 0;
		this.state.selected.papers = 0;
		this.state.selected.persons = 0;
		this.state.selected.courses = 0;

		if (this.props.relatedObjects) {
			this.props.relatedObjects.map(object => {
				this.state.relatedObjectIds.push(object.objectId);
				this.state.relatedObjectIds.push(object.pid);

				switch (object.objectType) {
					case 'tool':
						this.props.toolData.map(tool => {
							if (object.objectId === tool.id || object.objectId === JSON.stringify(tool.id)) {
								this.state.selected.tools++;
							}
						});
						break;
					case 'project':
						this.props.projectData.map(project => {
							if (object.objectId === project.id || object.objectId === JSON.stringify(project.id)) {
								this.state.selected.projects++;
							}
						});
						break;
					case 'paper':
						this.props.paperData.map(paper => {
							if (object.objectId === paper.id || object.objectId === JSON.stringify(paper.id)) {
								this.state.selected.papers++;
							}
						});
						break;
					case 'person':
						this.props.personData.map(person => {
							if (object.objectId === person.id || object.objectId === JSON.stringify(person.id)) {
								this.state.selected.persons++;
							}
						});
						break;
					case 'dataset':
						this.props.datasetData.map(dataset => {
							if (
								object.objectId === dataset.datasetid ||
								object.objectId === JSON.stringify(dataset.datasetid) ||
								object.pid === dataset.pid ||
								object.pid === JSON.stringify(dataset.pid)
							) {
								this.state.selected.datasets++;
							}
						});
						break;
					case 'course':
						this.props.courseData.map(course => {
							if (object.objectId === course.id || object.objectId === JSON.stringify(course.id)) {
								this.state.selected.courses++;
							}
						});
						break;
				}
			});
		}

		return (
			<Fragment>
				<div class='related-search-wrap'>
					<div className='realted-search-body'>
						<SimpleSearchBar
							searchString={this.state.searchString}
							doSearchMethod={this.props.doSearchMethod}
							doUpdateSearchString={this.props.doUpdateSearchString}
							userState={this.props.userState}
						/>
						{typeof this.props.summary.datasets !== 'undefined' ? (
							<div className='searchTabsHolder'>
								<div>
									<Tabs className='tabsBackground-shadow-bottom gray700-13' activeKey={key} onSelect={this.handleSelect}>
										<Tab
											eventKey='Datasets'
											title={
												'Datasets (' +
												(!this.props.summary.datasets ? '0' : this.props.summary.datasets - this.state.selected.datasets) +
												')'
											}
										/>
										<Tab
											eventKey='Tools'
											title={
												'Tools (' +
												(!this.props.summary.tools ? '0' : this.props.summary.tools - this.state.selected.tools - editingObjectTool) +
												')'
											}
										/>
										<Tab
											eventKey='Projects'
											title={
												'Projects (' +
												(!this.props.summary.projects
													? '0'
													: this.props.summary.projects - this.state.selected.projects - editingObjectProject) +
												')'
											}
										/>
										<Tab
											eventKey='Course'
											title={
												'Courses (' + (!this.props.summary.courses ? '0' : this.props.summary.courses - this.state.selected.courses) + ')'
											}
										/>
										<Tab
											eventKey='Papers'
											title={'Papers (' + (!this.props.summary.papers ? '0' : this.props.summary.papers - this.state.selected.papers) + ')'}
										/>
										<Tab
											eventKey='People'
											title={
												'People (' + (!this.props.summary.persons ? '0' : this.props.summary.persons - this.state.selected.persons) + ')'
											}
										/>
									</Tabs>
								</div>
							</div>
						) : (
							''
						)}
					</div>
				</div>

				<div className='relatedModalBackground'>
					<Container>
						<Row>
							<Col sm={1} lg={1} />
							<Col sm={10} lg={10} className='mt-2 mb-3'>
								{key === 'Datasets'
									? this.props.datasetData.map(dataset => {
											if (this.state.relatedObjectIds.includes(dataset.datasetid) || this.state.relatedObjectIds.includes(dataset.pid)) {
												return '';
											} else {
												let datasetPublisher;
												let datasetLogo;
												{
													!_.isEmpty(dataset.datasetv2) && _.has(dataset, 'datasetv2.summary.publisher.name')
														? (datasetPublisher = dataset.datasetv2.summary.publisher.name)
														: (datasetPublisher = '');
												}
												{
													!_.isEmpty(dataset.datasetv2) && _.has(dataset, 'datasetv2.summary.publisher.logo')
														? (datasetLogo = dataset.datasetv2.summary.publisher.logo)
														: (datasetLogo = '');
												}

												return (
													<RelatedObject
														key={dataset.id}
														data={dataset}
														activeLink={false}
														doAddToTempRelatedObjects={this.props.doAddToTempRelatedObjects}
														tempRelatedObjectIds={this.props.tempRelatedObjectIds}
														datasetPublisher={datasetPublisher}
														datasetLogo={datasetLogo}
													/>
												);
											}
									  })
									: ''}

								{key === 'Tools'
									? !this.props.toolData
										? ''
										: this.props.toolData.map(tool => {
												if (
													this.state.relatedObjectIds.includes(tool.id) ||
													this.state.relatedObjectIds.includes(JSON.stringify(tool.id)) ||
													tool.id === this.props.toolid
												) {
													return '';
												} else {
													return (
														<RelatedObject
															key={tool.id}
															data={tool}
															activeLink={false}
															doAddToTempRelatedObjects={this.props.doAddToTempRelatedObjects}
															tempRelatedObjectIds={this.props.tempRelatedObjectIds}
														/>
													);
												}
										  })
									: ''}

								{key === 'Projects'
									? !this.props.projectData
										? ''
										: this.props.projectData.map(project => {
												if (
													this.state.relatedObjectIds.includes(project.id) ||
													this.state.relatedObjectIds.includes(JSON.stringify(project.id)) ||
													project.id === this.props.projectid
												) {
													return '';
												} else {
													return (
														<RelatedObject
															key={project.id}
															data={project}
															activeLink={false}
															doAddToTempRelatedObjects={this.props.doAddToTempRelatedObjects}
															tempRelatedObjectIds={this.props.tempRelatedObjectIds}
														/>
													);
												}
										  })
									: ''}

								{key === 'Papers'
									? !this.props.paperData
										? ''
										: this.props.paperData.map(paper => {
												if (
													this.state.relatedObjectIds.includes(paper.id) ||
													this.state.relatedObjectIds.includes(JSON.stringify(paper.id)) ||
													paper.id === this.props.paperid
												) {
													return '';
												} else {
													return (
														<RelatedObject
															key={paper.id}
															data={paper}
															activeLink={false}
															doAddToTempRelatedObjects={this.props.doAddToTempRelatedObjects}
															tempRelatedObjectIds={this.props.tempRelatedObjectIds}
														/>
													);
												}
										  })
									: ''}

								{key === 'People'
									? !this.props.personData
										? ''
										: this.props.personData.map(person => {
												if (
													this.state.relatedObjectIds.includes(person.id) ||
													this.state.relatedObjectIds.includes(JSON.stringify(person.id))
												) {
													return '';
												} else {
													return (
														<RelatedObject
															key={person.id}
															data={person}
															activeLink={false}
															doAddToTempRelatedObjects={this.props.doAddToTempRelatedObjects}
															tempRelatedObjectIds={this.props.tempRelatedObjectIds}
														/>
													);
												}
										  })
									: ''}

								{key === 'Course'
									? !this.props.courseData
										? ''
										: this.props.courseData.map(course => {
												if (
													this.state.relatedObjectIds.includes(course.id) ||
													this.state.relatedObjectIds.includes(JSON.stringify(course.id))
												) {
													return '';
												} else {
													return (
														<RelatedObject
															key={course.id}
															data={course}
															activeLink={false}
															doAddToTempRelatedObjects={this.props.doAddToTempRelatedObjects}
															tempRelatedObjectIds={this.props.tempRelatedObjectIds}
														/>
													);
												}
										  })
									: ''}

								<div className='text-center'>
									{key === 'Datasets' && datasetCount > maxResult ? (
										<PaginationHelper
											doEntitiesCall={this.props.doSearchMethod}
											entityCount={datasetCount}
											statusKey={key}
											paginationIndex={this.props.datasetPaginationIndex}
											setPaginationIndex={this.setDatasetPaginationIndex}
											maxResult={maxResult}
											relatedResources={true}></PaginationHelper>
									) : (
										''
									)}

									{key === 'Tools' && toolCount > maxResult ? (
										<PaginationHelper
											doEntitiesCall={this.props.doSearchMethod}
											entityCount={toolCount}
											statusKey={key}
											paginationIndex={this.props.toolPaginationIndex}
											setPaginationIndex={this.setToolPaginationIndex}
											maxResult={maxResult}
											relatedResources={true}></PaginationHelper>
									) : (
										''
									)}

									{key === 'Projects' && projectCount > maxResult ? (
										<PaginationHelper
											doEntitiesCall={this.props.doSearchMethod}
											entityCount={projectCount}
											statusKey={key}
											paginationIndex={this.props.projectPaginationIndex}
											setPaginationIndex={this.setProjectPaginationIndex}
											maxResult={maxResult}
											relatedResources={true}></PaginationHelper>
									) : (
										''
									)}

									{key === 'Papers' && paperCount > maxResult ? (
										<PaginationHelper
											doEntitiesCall={this.props.doSearchMethod}
											entityCount={paperCount}
											statusKey={key}
											paginationIndex={this.props.paperPaginationIndex}
											setPaginationIndex={this.setPaperPaginationIndex}
											maxResult={maxResult}
											relatedResources={true}></PaginationHelper>
									) : (
										''
									)}

									{key === 'People' && personCount > maxResult ? (
										<PaginationHelper
											doEntitiesCall={this.props.doSearchMethod}
											entityCount={personCount}
											statusKey={key}
											paginationIndex={this.props.personPaginationIndex}
											setPaginationIndex={this.setPersonPaginationIndex}
											maxResult={maxResult}
											relatedResources={true}></PaginationHelper>
									) : (
										''
									)}

									{key === 'Course' && courseCount > maxResult ? (
										<PaginationHelper
											doEntitiesCall={this.props.doSearchMethod}
											entityCount={courseCount}
											statusKey={key}
											paginationIndex={this.props.coursePaginationIndex}
											setPaginationIndex={this.setCoursePaginationIndex}
											maxResult={maxResult}
											relatedResources={true}></PaginationHelper>
									) : (
										''
									)}
								</div>
							</Col>
							<Col sm={2} lg={2} />
						</Row>
					</Container>
				</div>
			</Fragment>
		);
	}
}

export default RelatedResourcesModal;
