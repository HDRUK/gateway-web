// /ShowObjects.js
import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import _ from 'lodash';
import Container from 'react-bootstrap/Container';
import SSOPage from './pages/sso/SSOPage';
import ToolPage from './pages/tool/ToolPage';
import PersonPage from './pages/person/PersonPage';
import ProjectPage from './pages/project/ProjectPage';
import PaperPage from './pages/paper/PaperPage';
import CoursePage from './pages/course/CoursePage';
import DatasetPage from './pages/dataset/DatasetPage';
import SearchPage from './pages/search/SearchPage';
import CollectionPage from './pages/collections/CollectionPage';
import PublicAnalyticsDashboard from './pages/publicDashboard/PublicAnalyticsDashboard';
import Account from './pages/dashboard/Account';
import Unsubscribe from './pages/dashboard/Unsubscribe';
import AddEditToolPage from './pages/tool/AddEditToolPage';
import AddEditProjectPage from './pages/project/AddEditProjectPage';
import AddEditPaperPage from './pages/paper/AddEditPaperPage';
import AddEditCoursePage from './pages/course/AddEditCoursePage';
import AddEditCollectionPage from './pages/collections/AddEditCollectionPage';
import DataAccessRequest from './pages/DataAccessRequest/DataAccessRequest';
import Loading from './pages/commonComponents/Loading';
import CompleteRegistration from './pages/registration/CompleteRegistration';
import LoginModal from './pages/commonComponents/LoginModal';
import Footer from './pages/commonComponents/Footer';
import LoginErrorPage from './pages/commonComponents/LoginErrorPage';
import ErrorModal from './pages/commonComponents/errorModal/ErrorModal';
import { GuardedRoute } from './pages/commonComponents/GuardedRoute';

var baseURL = require('./pages/commonComponents/BaseURL').getURL();
let actionBar, footer;

class HDRRouter extends Component {
	// initialize our state
	state = {
		userState: [
			{
				loggedIn: false,
				role: 'Reader',
				id: null,
				name: null,
				profileComplete: false,
				provider: null,
				advancedSearchRoles: [],
				acceptedAdvancedSearchTerms: false,
			},
		],
		isLoading: true,
		showError: false,
	};

	getRectTop = el => {
		if (el) {
			let rect = el.getBoundingClientRect();
			return rect.top;
		}
		return 0;
	};

	handleScroll = () => {
		actionBar = document.querySelector('.actionBar');
		footer = document.querySelector('.footerBottom');

		if (!_.isNil(actionBar) && !_.isNil(footer)) {
			// (distance of actionBar to the top of the screen + number of pixels the body is scrolled) + height of actionBar >= the distance of the footer to the top of the screen + body scroll
			if (
				this.getRectTop(actionBar) + document.body.scrollTop + actionBar.offsetHeight >=
				this.getRectTop(footer) + document.body.scrollTop
			) {
				actionBar.style.position = 'absolute';
				// compensate for the 50px margin on mainWrapper
				actionBar.style.bottom = '-50px';
			}

			// keep actionbar fixed if the window innerHeight is less than actual position of the footer in the document
			if (document.body.scrollTop + window.innerHeight < this.getRectTop(footer) + document.body.scrollTop) {
				actionBar.style.position = 'fixed';
				actionBar.style.bottom = '0px'; // remove the margin compensation on mainWrapper
			}
		}
	};

	hideModal = () => {
		this.setState({ showError: false });
	};

	async componentDidMount() {
		// register scroll event and bind to handleScroll
		window.addEventListener('scroll', this.handleScroll);

		let currentComponent = this;

		axios.defaults.withCredentials = true;
		axios.defaults.timeout = 60000;
		axios.interceptors.response.use(
			function (response) {
				return response;
			},
			function (error) {
				if (error) {
					if (error.response.status !== 404) {
						console.log(error);
						Sentry.captureException(error);
						return Promise.reject(error).then(currentComponent.setState({ showError: true }));
					}
					return error;
				}
			}
		);

		axios
			.get(baseURL + '/api/v1/auth/status')
			.then(async res => {
				let person = await axios.get(baseURL + '/api/v1/person/' + res.data.data[0].id);
				this.setState({
					userState: [
						{
							loggedIn: res.data.data[0].loggedIn,
							role: res.data.data[0].role,
							id: res.data.data[0].id,
							name: res.data.data[0].name,
							teams: res.data.data[0].teams,
							profileComplete: person.data.person.profileComplete,
							provider: res.data.data[0].provider,
							advancedSearchRoles: res.data.data[0].advancedSearchRoles,
							acceptedAdvancedSearchTerms: res.data.data[0].acceptedAdvancedSearchTerms,
						},
					],
					isLoading: false,
				});
			})
			.catch(error => {
				this.setState({
					userState: [
						{
							loggedIn: false,
							role: 'Reader',
							id: null,
							name: null,
						},
					],
					isLoading: false,
				});
			});
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	render() {
		const { isLoading, userState, showError } = this.state;
		if (isLoading) {
			return (
				<Container>
					<Loading />
				</Container>
			);
		}

		if (showError) {
			return (
				<Router>
					<ErrorModal show={this.state.showError} handleClose={this.hideModal} />
				</Router>
			);
		}

		return (
			<Router>
				<LoginModal userState={userState} />
				<div className='navBarGap'></div>
				<div className='mainWrap' onScroll={this.handleScroll}>
					<Switch>
						{userState[0].loggedIn && !userState[0].profileComplete ? (
							<Route render={props => <Account {...props} userState={userState} profileComplete={false} />} />
						) : (
							''
						)}
						<Route path='/search' render={props => <SearchPage {...props} userState={userState} />} />
						<Route path='/loginerror' render={props => <LoginErrorPage {...props} userState={userState} />} />
						<Route path='/person/:personID' render={props => <PersonPage {...props} userState={userState} />} />
						<Route path='/dataset/:datasetID' render={props => <DatasetPage {...props} userState={userState} />} />
						<Route path='/completeRegistration/:personID' render={props => <CompleteRegistration {...props} userState={userState} />} />
						<Route path='/sso' render={props => <SSOPage {...props} userState={userState} />} />
						<Route path='/account/unsubscribe/:userObjectID' render={props => <Unsubscribe {...props} userState={userState} />} />
						<Route path='/dashboard' render={props => <PublicAnalyticsDashboard {...props} userState={userState} />} />
						<GuardedRoute path='/data-access-request/dataset/:datasetId' component={DataAccessRequest} userState={userState} />
						<GuardedRoute path='/data-access-request/publisher/:publisherId' component={DataAccessRequest} userState={userState} />
						<GuardedRoute path='/data-access-request/:accessId' component={DataAccessRequest} userState={userState} />
						<GuardedRoute path='/account' component={Account} userState={userState} />
						<GuardedRoute path='/collection/add' component={AddEditCollectionPage} userState={userState} />
						<GuardedRoute path='/collection/edit/:collectionID' component={AddEditCollectionPage} userState={userState} />
						<Route path='/collection/:collectionID' render={props => <CollectionPage {...props} userState={userState} />} />
						<GuardedRoute path='/tool/add' component={AddEditToolPage} userState={userState} />
						<GuardedRoute path='/tool/edit/:toolID' component={AddEditToolPage} userState={userState} />
						<Route path='/tool/:toolID' render={props => <ToolPage {...props} userState={userState} />} />
						<GuardedRoute path='/project/add' component={AddEditProjectPage} userState={userState} />
						<GuardedRoute path='/project/edit/:projectID' component={AddEditProjectPage} userState={userState} />
						<Route path='/project/:projectID' render={props => <ProjectPage {...props} userState={userState} />} />
						<GuardedRoute path='/paper/add' component={AddEditPaperPage} userState={userState} />
						<GuardedRoute path='/paper/edit/:paperID' component={AddEditPaperPage} userState={userState} />
						<Route path='/paper/:paperID' render={props => <PaperPage {...props} userState={userState} />} />
						<GuardedRoute path='/course/add' component={AddEditCoursePage} userState={userState} />
						<GuardedRoute path='/course/edit/:courseID' component={AddEditCoursePage} userState={userState} />
						<Route path='/course/:courseID' render={props => <CoursePage {...props} userState={userState} />} />
						<Redirect to='/search?search=' />
					</Switch>
				</div>
				<Footer />
			</Router>
		);
	}
}
export default HDRRouter; 
