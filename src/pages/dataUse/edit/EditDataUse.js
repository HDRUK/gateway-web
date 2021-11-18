import React, { useState, useEffect, createRef } from 'react';
import * as Sentry from '@sentry/react';
import axios from 'axios';
import { baseURL } from '../../../configs/url.config';

import { Container } from 'react-bootstrap';
import EditFormDataUse from './EditDataUseForm';
import SearchBar from '../../commonComponents/searchBar/SearchBar';
import ErrorModal from '../../commonComponents/errorModal/ErrorModal';
import SideDrawer from '../../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../../commonComponents/userMessages/UserMessages';
import DataSetModal from '../../commonComponents/dataSetModal/DataSetModal';
import Loading from '../../commonComponents/Loading';
import SaveModal from '../SaveEditModal';

const EditDataUse = props => {
	const [data, setData] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [searchBar] = useState(createRef());
	const [searchString, setSearchString] = useState('');
	const [showDrawer, setShowDrawer] = useState(false);
	const [context, setContext] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [keywords, setKeywords] = useState([]);
	const [userState] = useState(
		props.userState || [
			{
				loggedIn: false,
				role: 'Reader',
				id: null,
				name: null,
			},
		]
	);

	useEffect(async () => {
		setIsLoading(true);
		await Promise.all([doGetKeywordsCall()]);
		axios.get(baseURL + '/api/v2/data-use-registers/' + props.match.params.datauseID).then(res => {
			setData(res.data);
			setIsLoading(false);
		});
	}, []);

	let showError = false;

	const showModalHandler = () => {
		showError = true;
	};

	const hideModalHandler = props => {
		showError = false;
	};

	const doSearch = e => {
		//fires on enter on searchbar
		if (e.key === 'Enter') window.location.href = `/search?search=${encodeURIComponent(searchString)}`;
	};

	const updateSearchString = searchString => {
		setSearchString(searchString);
	};

	const toggleDrawer = () => {
		if (showDrawer === true) {
			searchBar.current.getNumberOfUnreadMessages();
		}
		setShowDrawer(!showDrawer);
	};

	const toggleModal = (showEnquiry = false, context = {}) => {
		setShowModal(!showModal);
		setContext(context);
		setShowDrawer(showEnquiry);
	};

	const showSaveModal = () => {
		setShowModal(true);
		console.log('saved');
	};

	const hideSaveModal = () => {
		setShowModal(false);
	};

	const doGetKeywordsCall = () => {
		return new Promise((resolve, reject) => {
			axios.get(baseURL + '/api/v1/search/filter/feature/tool').then(res => {
				var tempFeaturesArray = [
					'Arbitrage',
					'Association Rules',
					'Attribution Modeling',
					'Bayesian Statistics',
					'Clustering',
					'Collaborative Filtering',
					'Confidence Interval',
					'Cross-Validation',
					'Decision Trees',
					'Deep Learning',
					'Density Estimation',
					'Ensembles',
					'Experimental Design',
					'Feature Selection',
					'Game Theory',
					'Geospatial Modeling',
					'Graphs',
					'Imputation',
					'Indexation / Cataloguing',
					'Jackknife Regression',
					'Lift Modeling',
					'Linear Regression',
					'Linkage Analysis',
					'Logistic Regression',
					'Model Fitting',
					'Monte-Carlo Simulation',
					'Naive Bayes',
					'Nearest Neighbors - (k-NN)',
					'Neural Networks',
					'Pattern Recognition',
					'Predictive Modeling',
					'Principal Component Analysis - (PCA)',
					'Random Numbers',
					'Recommendation Engine',
					'Relevancy Algorithm',
					'Rule System',
					'Scoring Engine',
					'Search Engine',
					'Segmentation',
					'Supervised Learning',
					'Support Vector Machine - (SVM)',
					'Survival Analysis',
					'Test of Hypotheses',
					'Time Series',
					'Yield Optimization',
				];

				res.data.data[0].forEach(fe => {
					if (!tempFeaturesArray.includes(fe) && fe !== '') {
						tempFeaturesArray.push(fe);
					}
				});

				setKeywords(
					tempFeaturesArray.sort(function (a, b) {
						return a.toUpperCase() < b.toUpperCase() ? -1 : a.toUpperCase() > b.toUpperCase() ? 1 : 0;
					})
				);
				resolve();
			});
		});
	};

	if (isLoading) {
		return (
			<Container>
				<Loading data-testid='outerLoadingSpinner' />
			</Container>
		);
	}

	return (
		<Sentry.ErrorBoundary fallback={<ErrorModal show={showModalHandler} handleClose={hideModalHandler} />}>
			<div>
				<SearchBar
					ref={searchBar}
					searchString={searchString}
					doSearchMethod={doSearch}
					doUpdateSearchString={updateSearchString}
					userState={userState}
					doToggleDrawer={toggleDrawer}
				/>

				<EditFormDataUse data={data} userState={userState} keywordsData={keywords} />
				<SideDrawer open={showDrawer} closed={toggleDrawer}>
					<UserMessages userState={userState[0]} closed={toggleDrawer} toggleModal={toggleModal} drawerIsOpen={toggleDrawer} />
				</SideDrawer>

				<DataSetModal open={showModal} context={context} closed={toggleModal} userState={userState[0]} />
			</div>
		</Sentry.ErrorBoundary>
	);
};

/* 



<Sentry.ErrorBoundary fallback={<ErrorModal show={showModalHandler} handleClose={hideModalHandler} />}>
			<SearchBar
				ref={searchBar}
				searchString={searchString}
				doSearchMethod={doSearch}
				doUpdateSearchString={updateSearchString}
				userState={userState}
				doToggleDrawer={toggleDrawer}
			/>
			<div className='datause-card datause-edit-card'>
				<Row>
					<Col md={10}>
						<h5 className='black-20-semibold'>Edit a data use</h5>
					</Col>
					<Col md={2}>
						<span className='badge-datause datause-badge-right'>
							<SVGIcon name='datauseicon' fill={'#fff'} className='badgeSvg mr-2' viewBox='-2 -2 22 22' />
							<span>Data use</span>
						</span>
					</Col>
				</Row>

				<Row>
					<Col md={10}>
						<p className='gray800-14-normal'>
							A data use register is a public record of data an organisation has shared with other individuals and organisations. Data uses
							help people understand how data is being used and why. Please edit data uses to ensure that the information is accurate and
							up-to-date
						</p>
					</Col>
				</Row>
				<hr className='datause-border' />
				<Row>
					<EditFormDataUse data={data} />
				</Row>
				{userState[0].loggedIn && (
					<ActionBar userState={userState}>
						<Button className='datause-cancel dark-14'>Cancel</Button>
						<Button onClick={showSaveModal} className='datause-save white-14'>
							Save
						</Button>
					</ActionBar>
				)}
				{showModal && <SaveModal savedEdit={true} id={props.match.params.datauseID} show={showSaveModal} hide={hideSaveModal} />}
			</div>
		</Sentry.ErrorBoundary>


*/

export default EditDataUse;
