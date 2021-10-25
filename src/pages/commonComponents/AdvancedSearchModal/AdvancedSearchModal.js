import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { ReactComponent as CDStar } from '../../../images/cd-star.svg';
import './AdvancedSearchModal.scss';
import AdvancedSearchRequestAccessModal from '../../dashboard/AdvancedSearchRequestAccessModal';
import AdvancedSearchTermsandConditionsModal from '../../dashboard/AdvancedSearchTAndCsModal';
import axios from 'axios';
import AdvancedSearchModalBody from './AdvancedSearchModalBody';
import cohortDiscoveryImage from '../../../images/cohort-discovery.jpg';
import dataUtilityImage from '../../../images/data-utility.png';
import googleAnalytics from '../../../tracking';

const baseURL = require('../BaseURL').getURL();
const GENERAL_ACCESS = 'GENERAL_ACCESS';
const BANNED = 'BANNED';
const urlEnv = require('../BaseURL').getURLEnv();

const AdvancedSearchModal = ({ open, closed, userProps, startDataUtilityWizardJourney }) => {
	const [userState, setUserState] = useState(userProps);
	const [showRequestAccessModal, setShowRequestAccessModal] = useState(false);
	const [showTermsandConditionsModal, setShowTermsAndConditionsModal] = useState(false);
	const handleClose = action => closed(action);

	const accessRQuest = async () => {
		const approvedUser = await authorisedForAdvancedSearch();
		if (approvedUser && userState.acceptedAdvancedSearchTerms) {
			console.log('Redirecting to RQuest');
			if (urlEnv === 'prod') {
				googleAnalytics.recordVirtualPageView('Cohort discovery tool');
				googleAnalytics.recordEvent('Datasets', 'Clicked search using cohort discovery', 'Opened cohort discovery tool');
				window.location.assign('https://rquest.prod.healthdatagateway.org/bcrquest/');
			} else {
				window.location.assign('https://rquest.test.healthdatagateway.org/bcrquest/');
			}
		} else {
			determineModalToShow(approvedUser);
		}
	};

	const authorisedForAdvancedSearch = async () => {
		if (userState.advancedSearchRoles.includes(BANNED)) {
			return false;
		} else if (userState.advancedSearchRoles.includes(GENERAL_ACCESS)) {
			return true;
		} else if (userState.provider === 'oidc') {
			//if user is from open athens but not authorised and not banned, assign them an advanced search role
			let authorised = false;
			await axios
				.patch(baseURL + '/api/v1/users/advancedSearch/roles/' + userState.id)
				.then(res => {
					authorised = true;
					let newUserState = userState;
					newUserState.advancedSearchRoles = res.data.response.advancedSearchRoles;
					setUserState(newUserState);
				})
				.catch(err => {
					console.error(err.message);
				});
			return authorised;
		} else {
			return false;
		}
	};

	const determineModalToShow = approvedUser => {
		if (approvedUser) {
			toggleShowTermsandConditionsModal();
			handleClose();
		} else {
			toggleShowRequestAccessModal();
			handleClose();
		}
	};

	const updateUserAcceptedAdvancedSearchTerms = async () => {
		await axios
			.patch(baseURL + '/api/v1/users/advancedSearch/terms/' + userState.id, {
				acceptedAdvancedSearchTerms: true,
			})
			.then(res => {
				// Update the state so that if user moves away from page they are still authorised
				let newUserState = userState;
				newUserState.acceptedAdvancedSearchTerms = res.data.response.acceptedAdvancedSearchTerms;
				setUserState(newUserState);
				accessRQuest();
			})
			.catch(err => {
				console.error(err.message);
			});
	};

	const toggleShowRequestAccessModal = () => {
		setShowRequestAccessModal(!showRequestAccessModal);
	};

	const toggleShowTermsandConditionsModal = () => {
		setShowTermsAndConditionsModal(!showTermsandConditionsModal);
	};

	const showLoginModal = () => {
		// 1. add class to body to stop background scroll
		document.body.classList.add('modal-open');

		document.getElementById('myModal').style.display = 'block';
		document.getElementById('loginWayFinder').style.display = 'none';
		document.getElementById('loginButtons').style.display = 'block';
		document.getElementById('loginModalTitle').innerHTML = 'Sign in or create a new account';
		document.getElementById('modalRequestSection').style.display = 'none';

		window.onclick = function (event) {
			if (event.target === document.getElementById('myModal')) {
				// 2. remove class modal-open from body
				document.body.classList.remove('modal-open');
				document.getElementById('myModal').style.display = 'none';
			}
		};
	};

	return (
		<>
			<Modal
				show={open}
				onHide={handleClose}
				enforceFocus={false}
				className='advanced-search-modal'
				size='lg'
				aria-labelledby='contained-modal-title-vcenter'
				centered>
				<Modal.Header closeButton>
					<div>
						<div className='advanced-search-modal-header ml-3'>
							<CDStar fill='#f98e2b' height='20' width='20' className='mr-2' />
							<h5 className='black-20'> Advanced Search</h5>
						</div>
						<p className='gray800-14 ml-3'>
							Sometimes search terms and filters are not quite what you need. Here are other ways of discovering datasets.
						</p>
					</div>
				</Modal.Header>
				<AdvancedSearchModalBody
					headerText='Cohort Discovery'
					isBeta
					bodyText='Search based on characteristics such as disease, age, and location. Queries are made on the actual dataset, not just metadata. Available on a limited number of datasets for now, with more added every month.'
					learnMoreLink='https://www.healthdatagateway.org/about/cohort-discovery'
					loggedIn={userState.loggedIn}
					buttonText='Search using cohort discovery'
					signedOutText='You must be signed in to use cohort discovery'
					showLoginModal={showLoginModal}
					buttonClick={accessRQuest}
					imageSrc={cohortDiscoveryImage}
				/>
				<AdvancedSearchModalBody
					headerText='Data utility wizard'
					isBeta
					bodyText='A tool to help refine your search to only datasets that meet your data utility requirements.'
					learnMoreLink='https://www.healthdatagateway.org/about/data-utility-wizard'
					doesNotRequireSignIn
					buttonClick={() => {
						googleAnalytics.recordVirtualPageView('Data utility wizard');
						googleAnalytics.recordEvent('Datasets', 'Clicked search using data utility wizard', 'Opened data utility wizard modal');
						handleClose();
						startDataUtilityWizardJourney(1);
					}}
					buttonText='Search using data utility wizard'
					imageSrc={dataUtilityImage}
				/>
				<Modal.Footer>
					<div className='gray800-14 btn-light entryBox' style={{ textAlign: 'center' }}>
						Other advanced search options coming soon
					</div>
				</Modal.Footer>
			</Modal>
			<AdvancedSearchTermsandConditionsModal
				open={showTermsandConditionsModal}
				close={() => toggleShowTermsandConditionsModal()}
				updateUserAcceptedAdvancedSearchTerms={() => updateUserAcceptedAdvancedSearchTerms()}></AdvancedSearchTermsandConditionsModal>
			<AdvancedSearchRequestAccessModal
				open={showRequestAccessModal}
				close={() => toggleShowRequestAccessModal()}
				userId={userState.id}></AdvancedSearchRequestAccessModal>
		</>
	);
};

export default AdvancedSearchModal;
