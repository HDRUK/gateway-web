const __dataset = {
	count: 9,
	entity: 'dataset',
	maxDatasets: 0,
	maxPapers: null,
	maxPeople: null,
	maxProjects: 57,
	maxTools: 6,
	_id: 'data visualisation',
};

const __tool = {
	count: 4,
	entity: 'tool',
	maxDatasets: 0,
	maxPapers: null,
	maxPeople: null,
	maxProjects: 86,
	maxTools: 10,
	_id: 'cancer covid',
};

const __paper = {
	count: 4,
	entity: 'paper',
	maxDatasets: 0,
	maxPapers: null,
	maxPeople: null,
	maxProjects: 86,
	maxTools: 10,
	_id: 'cancer covid',
};

const __project = {
	count: 4,
	entity: 'project',
	maxDatasets: 0,
	maxPapers: null,
	maxPeople: null,
	maxProjects: 0,
	maxTools: 10,
	_id: 'cancer covid',
};

const __person = {
	count: 1,
	entity: 'person',
	maxDatasets: 12,
	maxPapers: 0,
	maxPeople: null,
	maxProjects: 4,
	maxTools: 2,
	_id: 'c',
};

module.exports = {
	datasetMock: __dataset,
	toolMock: __tool,
	paperMock: __paper,
	projectMock: __project,
	personMock: __person,
};
