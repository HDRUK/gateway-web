import React, { Fragment } from 'react';
import axios from 'axios';
import { Row, Col, Container } from 'react-bootstrap/';
import Loading from '../../commonComponents/Loading';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import moment from 'moment';

var baseURL = require('../../commonComponents/BaseURL').getURL();

class CustodianApplication extends React.Component {
	state = {
		data: {},
		name: '',
		dataset: '',
		isLoading: true,
	};

	constructor(props) {
		super(props);
		this.state.data = props.data;
	}

	componentDidMount() {
		this.getDataSearchFromDb();
		this.getDatasetSearch();
	}

	getDataSearchFromDb = () => {
		this.setState({ isLoading: true });
		axios.get(baseURL + '/api/v1/person/' + this.state.data.userId).then(res => {
			if (typeof res.data.data[0] === 'undefined') {
				this.setState({
					name: '',
				});
			} else {
				this.setState({
					name: res.data.data[0].firstname + ' ' + res.data.data[0].lastname,
				});
			}
		});
	};

	getDatasetSearch = () => {
		this.setState({ isLoading: true });
		axios.get(baseURL + '/api/v1/datasets/' + this.state.data.dataSetId).then(res => {
			this.setState({
				dataset: res.data.data.label,
				isLoading: false,
			});
		});
	};

	getProgress = () => {
		switch (this.props.data.applicationStatus) {
			case 'presubmission':
				return 'Pre-submission';
			case 'submitted':
				return 'In review';
			case 'approved':
				return 'Approved';
			case 'rejected':
				return 'Rejected';

			default:
				return '';
		}
	};

	render() {
		const { isLoading, name, dataset } = this.state;

		if (isLoading) {
			return (
				<Container>
					<Loading />
				</Container>
			);
		}
		return (
			<Fragment>
				<Col sm={2} lg={2} className='pt-2 gray800-14'>
					<span>{moment(this.props.data.updatedAt).format('D MMMM YYYY HH:mm')}</span>
				</Col>
				<Col sm={3} lg={4} className='pt-2 gray800-14'>
					<span> {dataset}</span>
				</Col>
				<Col sm={3} lg={2} className='pt-2 gray800-14'>
					<span> {name} </span>
				</Col>
				<Col sm={2} lg={2} className='pt-2 gray800-14'>
					<span>{this.getProgress()}</span>
				</Col>
				<Col sm={2} lg={2} className='pr-5'>
					<DropdownButton variant='outline-secondary' alignRight title='Actions' className='floatRight'>
						<Dropdown.Item href=''>View</Dropdown.Item>
					</DropdownButton>
				</Col>
			</Fragment>
		);
	}
}

export default CustodianApplication;
