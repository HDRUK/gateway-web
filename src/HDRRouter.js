// /ShowObjects.js
import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import SSOPage from './pages/sso/SSOPage';
import ToolPage from './pages/tool/ToolPage';
import PersonPage from './pages/person/PersonPage';
import ProjectPage from './pages/project/ProjectPage';
import PaperPage from './pages/paper/PaperPage';
import DatasetPage from './pages/dataset/DatasetPage';
import SearchPage from './pages/search/SearchPage';
import CollectionPage from './pages/collections/CollectionPage';

import Account from './pages/dashboard/Account';
import Unsubscribe from './pages/dashboard/Unsubscribe';

import AddEditToolPage from './pages/tool/AddEditToolPage';
import AddEditProjectPage from './pages/project/AddEditProjectPage';
import AddEditPaperPage from './pages/paper/AddEditPaperPage';
import AddCollectionPage from './pages/collections/AddCollectionPage';
import EditCollectionPage from './pages/collections/EditCollectionPage';

import DataAccessRequest from './pages/DataAccessRequest/DataAccessRequest';
import Loading from './pages/commonComponents/Loading'
import CompleteRegistration from './pages/registration/CompleteRegistration'
import LoginModal from './pages/commonComponents/LoginModal';
import Footer from './pages/commonComponents/Footer';
import LoginErrorPage from './pages/commonComponents/LoginErrorPage';

var baseURL = require('./pages/commonComponents/BaseURL').getURL();

class HDRRouter extends Component {
    // initialize our state
    state = {
        userState: [
            {
                loggedIn: false,
                role: 'Reader',
                id: null,
                name: null
            }
        ],
        isLoading: true,
    };

    async componentDidMount() {
        axios.defaults.withCredentials = true;
        axios
            .get(baseURL + '/api/v1/auth/status')
            .then((res) => {
                this.setState({
                    userState: [
                        {
                            loggedIn: res.data.data[0].loggedIn,
                            role: res.data.data[0].role,
                            id: res.data.data[0].id,
                            name: res.data.data[0].name,
                            teams: res.data.data[0].teams
                        }
                    ],
                    isLoading: false
                });
            })
            .catch((error) => {
                this.setState({
                    userState: [
                        {
                            loggedIn: false,
                            role: 'Reader',
                            id: null,
                            name: null
                        }
                    ],
                    isLoading: false
                });
            })
    }

    render() {
        const { isLoading, userState } = this.state;

        if (isLoading) {
            return (
                <Container>
                    <Loading />
                </Container>
            );
        }

        return (
            <Router>
                <LoginModal userState={userState} />
                <div className='navBarGap'></div>
                <div className='mainWrap'>
                    <Switch>
                        <Route path='/search' render={(props) => <SearchPage {...props} userState={userState} />} />
                        <Route path='/loginerror' render={(props) => <LoginErrorPage {...props} userState={userState} />} />
                        <Route path='/person/:personID' render={(props) => <PersonPage {...props} userState={userState} />} />
                        <Route path='/dataset/:datasetID' render={(props) => <DatasetPage {...props} userState={userState} />} />
                        <Route path='/completeRegistration/:personID' render={(props) => <CompleteRegistration {...props} userState={userState} />} />
                        <Route path='/sso' render={(props) => <SSOPage {...props} userState={userState} />} />
                        <Route path='/account/unsubscribe/:userObjectID' render={(props) => <Unsubscribe {...props} userState={userState} />} />
                        
                        {userState[0].loggedIn ? (<Route path='/data-access-request/dataset/:datasetId' render={(props) => <DataAccessRequest {...props} userState={userState} />} />) : ''}
                        {userState[0].loggedIn ? (<Route path='/data-access-request/publisher/:publisherId' render={(props) => <DataAccessRequest {...props} userState={userState} />} />) : ''}
                        {userState[0].loggedIn ? (<Route path='/data-access-request/:accessId' render={(props) => <DataAccessRequest {...props} userState={userState} />} />) : ''}
                                                
                        {userState[0].loggedIn ? (<Route path='/account' render={(props) => <Account {...props} userState={userState} />} />) : ''}
                        
                        {userState[0].loggedIn ? (<Route path='/addcollection' render={(props) => <AddCollectionPage {...props} userState={userState} /> } />) : ''}
                        {userState[0].loggedIn ? (<Route path='/editcollection/:collectionID' render={(props) => <EditCollectionPage {...props} userState={userState} /> } />) : ''} 
                        <Route path='/collection/:collectionID' render={(props) => <CollectionPage {...props} userState={userState} />} />

                        {userState[0].loggedIn ? (<Route path='/tool/add' render={(props) => <AddEditToolPage {...props} userState={userState} /> } />) : ''}
                        {userState[0].loggedIn ? (<Route path='/tool/edit/:toolID' render={(props) => <AddEditToolPage {...props} userState={userState} isEdit="true" /> } />) : ''}
                        <Route path='/tool/:toolID' render={(props) => <ToolPage {...props} userState={userState} />} />
                        
                        {userState[0].loggedIn ? (<Route path='/project/add' render={(props) => <AddEditProjectPage {...props} userState={userState} /> } />) : ''}
                        {userState[0].loggedIn ? (<Route path='/project/edit/:projectID' render={(props) => <AddEditProjectPage {...props} userState={userState} isEdit="true"  /> } />) : ''}
                        <Route path='/project/:projectID' render={(props) => <ProjectPage {...props} userState={userState} />} />
                        
                        {userState[0].loggedIn ? (<Route path='/paper/add' render={(props) => <AddEditPaperPage {...props} userState={userState} /> } />) : ''}
                        {userState[0].loggedIn ? (<Route path='/paper/edit/:paperID' render={(props) => <AddEditPaperPage {...props} userState={userState} isEdit="true" /> } />) : ''}
                        <Route path='/paper/:paperID' render={(props) => <PaperPage {...props} userState={userState} />} />
                        

                        {/* Catch all path */}
                        <Redirect to="/search?search=" />
                    </Switch>
                </div>
                <Footer />
            </Router>
        );
    }
}

export default HDRRouter;
