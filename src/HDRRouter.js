// /ShowObjects.js
import { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import _ from 'lodash';
import SSOPage from './pages/sso/SSOPage';
import ToolPage from './pages/tool/ToolPage';
import PersonPage from './pages/person/PersonPage';
import PaperPage from './pages/paper/PaperPage';
import CoursePage from './pages/course/CoursePage';
import DatasetPage from './pages/dataset/DatasetPage';
import ViewDataUsePage from './pages/dataUse/view/ViewDataUse';
import EditDataUsePage from './pages/dataUse/edit/EditDataUse';
import SearchPage from './pages/search/SearchPage';
import CollectionPage from './pages/collections/CollectionPage';
import PublicAnalyticsDashboard from './pages/publicDashboard/PublicAnalyticsDashboard';
import Account from './pages/dashboard/Account';
import Unsubscribe from './pages/dashboard/Unsubscribe';
import AddEditToolPage from './pages/tool/AddEditToolPage';
import AddEditPaperPage from './pages/paper/AddEditPaperPage';
import AddEditCoursePage from './pages/course/AddEditCoursePage';
import AddEditCollectionPage from './pages/collections/AddEditCollectionPage';
import DataAccessRequest from './pages/DataAccessRequest/DataAccessRequest';
import DataAccessRequestCustomiseForm from './pages/dataAccessRequestCustomiseForm/DataAccessRequestCustomiseForm';
import CompleteRegistration from './pages/registration/CompleteRegistration';
import LoginModal from './pages/commonComponents/LoginModal';
import Footer from './pages/commonComponents/Footer';
import LoginErrorPage from './pages/commonComponents/LoginErrorPage';
import ErrorModal from './pages/commonComponents/errorModal/ErrorModal';
import DatasetOnboarding from './pages/DatasetOnboarding/DatasetOnboarding';
import { GuardedRoute } from './pages/commonComponents/GuardedRoute';
import AdvancedSearchTAndCs from './pages/dashboard/AdvancedSearchTAndCs';

import { NotificationContainer } from 'react-notifications';

import './css/custom-css-bootstrap-magic-2020-02-10.css';
import 'react-datepicker/dist/react-datepicker.css';
import './css/styles.scss';
import 'react-notifications/lib/notifications.css';
import { withAuth } from 'context/AuthContext';

let actionBar, footer;

class HDRRouter extends Component {
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
                // compensate for the 100px margin on mainWrapper
                actionBar.style.bottom = '-100px';
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
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    render() {
        const { userState, showError } = this.props;

        if (showError) {
            return <ErrorModal show={this.state.showError} handleClose={this.hideModal} />;
        }

        return (
            userState && (
                <>
                    <NotificationContainer />
                    <LoginModal userState={userState} />
                    <div className='navBarGap'></div>
                    <div className='mainWrap' onScroll={this.handleScroll}>
                        <Switch>
                            <Route path='/status'>
                                <h2>Application currently up</h2>
                            </Route>
                            {userState[0].loggedIn && !userState[0].profileComplete ? (
                                <Route render={props => <Account {...props} userState={userState} profileComplete={false} />} />
                            ) : (
                                ''
                            )}
                            <Route path='/search' render={props => <SearchPage {...props} userState={userState} />} />
                            <Route path='/loginerror' render={props => <LoginErrorPage {...props} userState={userState} />} />
                            <Route path='/person/:personID' render={props => <PersonPage {...props} userState={userState} />} />
                            <Route path='/dataset/:datasetID' render={props => <DatasetPage {...props} userState={userState} />} />
                            <Route path='/datause/:datauseID' render={props => <ViewDataUsePage {...props} userState={userState} />} />
                            <GuardedRoute path='/datauseRegister/edit/:datauseID' component={EditDataUsePage} userState={userState} />
                            <Route
                                path='/completeRegistration/:personID'
                                render={props => <CompleteRegistration {...props} userState={userState} />}
                            />
                            <Route path='/sso' render={props => <SSOPage {...props} userState={userState} />} />
                            <Route
                                path='/account/unsubscribe/:userObjectID'
                                render={props => <Unsubscribe {...props} userState={userState} />}
                            />
                            <Route path='/dashboard' render={props => <PublicAnalyticsDashboard {...props} userState={userState} />} />
                            <GuardedRoute
                                path='/data-access-request/customiseForm/:publisherID'
                                component={DataAccessRequestCustomiseForm}
                                userState={userState}
                            />
                            <GuardedRoute path='/dataset-onboarding/:id' component={DatasetOnboarding} userState={userState} />
                            <GuardedRoute
                                path='/data-access-request/dataset/:datasetId'
                                component={DataAccessRequest}
                                userState={userState}
                            />
                            <GuardedRoute
                                path='/data-access-request/publisher/:publisherId'
                                component={DataAccessRequest}
                                userState={userState}
                            />
                            <GuardedRoute path='/data-access-request/:accessId' component={DataAccessRequest} userState={userState} />
                            <GuardedRoute path='/account' component={Account} userState={userState} />
                            <GuardedRoute path='/collection/add' component={AddEditCollectionPage} userState={userState} />
                            <GuardedRoute path='/collection/edit/:collectionID' component={AddEditCollectionPage} userState={userState} />
                            <Route path='/collection/:collectionID' render={props => <CollectionPage {...props} userState={userState} />} />
                            <GuardedRoute path='/tool/add' component={AddEditToolPage} userState={userState} />
                            <GuardedRoute path='/tool/edit/:toolID' component={AddEditToolPage} userState={userState} />
                            <Route path='/tool/:toolID' render={props => <ToolPage {...props} userState={userState} />} />
                            <GuardedRoute path='/paper/add' component={AddEditPaperPage} userState={userState} />
                            <GuardedRoute path='/paper/edit/:paperID' component={AddEditPaperPage} userState={userState} />
                            <Route path='/paper/:paperID' render={props => <PaperPage {...props} userState={userState} />} />
                            <GuardedRoute path='/course/add' component={AddEditCoursePage} userState={userState} />
                            <GuardedRoute path='/course/edit/:courseID' component={AddEditCoursePage} userState={userState} />
                            <Route path='/course/:courseID' render={props => <CoursePage {...props} userState={userState} />} />
                            <Route
                                path='/advanced-search-terms/'
                                render={props => <AdvancedSearchTAndCs {...props} userState={userState} />}
                            />
                            <Redirect to='/search?search=' />
                        </Switch>
                    </div>
                    <Footer />
                </>
            )
        );
    }
}
export default withAuth(HDRRouter);
