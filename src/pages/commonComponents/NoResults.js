import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

var baseURL = require('./BaseURL').getURL();

class NoResults extends React.Component {
	state = {
		searchString: '',
		type: '',
	};

	constructor(props) {
		super(props);
		this.state.searchString = props.searchString;
		this.state.type = props.type;
	}

	render() {
		const { searchString, type } = this.state;

		return (
			<div>
				<Row className='mt-4'>
					<Col className='gray800-14 text-center'>
						<span>
							{' '}
							We couldn’t find any {type} matching the search term ‘{searchString}’{' '}
						</span>
					</Col>
				</Row>

				{(() => {
					if (type === 'datasets') {
						return (
							<Row className='mt-3'>
								<Col className='gray800-14 text-center'>
									<span>
										{' '}
										Try searching for ‘
										<a href={'/search?search=' + 'COVID-19'} className='purple-14'>
											COVID-19
										</a>
										’ if you want to see examples of datasets{' '}
									</span>
								</Col>
							</Row>
						);
					} else if (type === 'tools') {
						return (
							<>
								<Row className='mt-3'>
									<Col className='gray800-14 text-center'>
										<span>
											{' '}
											Tools may be repositories, software, guidelines, courses or any useful resources that can be used in research or
											analysis.{' '}
										</span>
									</Col>
								</Row>
								<Row className='mt-3'>
									<Col className='gray800-14 text-center'>
										<span>
											{' '}
											Try searching for ‘
											<a href={'/search?search=' + 'COVID-19'} className='purple-14'>
												COVID-19
											</a>
											’ if you want to see examples of tools{' '}
										</span>
									</Col>
								</Row>
							</>
						);
					} else if (type === 'projects') {
						return (
							<>
								<Row className='mt-3'>
									<Col className='gray800-14 text-center'>
										<span> Project can be research projects, work-in-progress, initiatives or any other type of activity. </span>
									</Col>
								</Row>
								<Row className='mt-3'>
									<Col className='gray800-14 text-center'>
										<span>
											{' '}
											Try searching for ‘
											<a href={'/search?search=' + 'COVID-19'} className='purple-14'>
												COVID-19
											</a>
											’ if you want to see examples of projects{' '}
										</span>
									</Col>
								</Row>
							</>
						);
					} else if (type === 'papers') {
						return (
							<>
								<Row className='mt-3'>
									<Col className='gray800-14 text-center'>
										<span>
											{' '}
											Try searching for ‘
											<a href={'/search?search=' + 'COVID-19'} className='purple-14'>
												COVID-19
											</a>
											’ if you want to see examples of papers{' '}
										</span>
									</Col>
								</Row>
							</>
						);
					} else if (type === 'profiles') {
						return <></>;
					}
				})()}
			</div>
		);
	}
}

export default NoResults;
