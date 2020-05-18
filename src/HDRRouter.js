// /ShowObjects.js
import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import SSOPage from './pages/sso/SSOPage';
import ToolPage from './pages/tool/ToolPage';
import PersonPage from './pages/person/PersonPage';
import ProjectPage from './pages/project/ProjectPage';
import DatasetPage from './pages/dataset/DatasetPage';
import LandingPage from './pages/landing/LandingPage';
import SearchPage from './pages/search/SearchPage';
import AddToolPage from './pages/tool/AddToolPage';
import AddProjectPage from './pages/project/AddProjectPage';
import Account from './pages/dashboard/Account';
import EditToolPage from './pages/tool/EditToolPage';
import EditProjectPage from './pages/project/EditProjectPage';
import Request from './pages/request/Request';
import Loading from './pages/commonComponents/Loading'
import CompleteRegistration from './pages/registration/CompleteRegistration'

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
    isLoading: true
  };

  componentDidMount() {
    axios.defaults.withCredentials = true;
    axios
      .get(baseURL + '/api/v1/auth/status')
      .then((res) => {
        this.setState({
          userState: [
            {
              loggedIn: true,
              role: res.data.data[0].role,
              id: res.data.data[0].id,
              name: res.data.data[0].name
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
      });
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
        <div>
          <Switch>
          
            <Route path='/request-access' render={(props) => <Request {...props} userState={userState} />} />
            <Route path='/search' render={(props) => <SearchPage {...props} userState={userState} />} />
            <Route path='/tool/:toolID' render={(props) => <ToolPage {...props} userState={userState} />} />
            <Route path='/project/:projectID' render={(props) => <ProjectPage {...props} userState={userState} />} />
            <Route path='/person/:personID' render={(props) => <PersonPage {...props} userState={userState} />} />
            <Route path='/dataset/:datasetID' render={(props) => <DatasetPage {...props} userState={userState} />} />
            <Route path='/completeRegistration/:personID' render={(props) => <CompleteRegistration {...props} userState={userState} />} />
            <Route path='/sso' render={(props) => <SSOPage {...props} userState={userState} />} />

            {userState[0].loggedIn ? (
              <Route
                path='/account'
                render={(props) => <Account {...props} userState={userState} />}
              />
            ) : (
              <Route
                path='/'
                render={(props) => (
                  <LandingPage {...props} userState={userState} />
                )}
              />
            )}

            {userState[0].loggedIn ? (
              <Route
                path='/addtool'
                render={(props) => (
                  <AddToolPage {...props} userState={userState} />
                )}
              />
            ) : (
              <Route
                path='/'
                render={(props) => (
                  <LandingPage {...props} userState={userState} />
                )}
              />
            )}

            {userState[0].loggedIn ? (
              <Route
                path='/addproject'
                render={(props) => (
                  <AddProjectPage {...props} userState={userState} />
                )}
              />
            ) : (
              <Route
                path='/'
                render={(props) => (
                  <LandingPage {...props} userState={userState} />
                )}
              />
            )}

            {userState[0].loggedIn ? (
              <Route
                path='/edittool/:toolID'
                render={(props) => (
                  <EditToolPage {...props} userState={userState} />
                )}
              />
            ) : (
              <Route
                path='/'
                render={(props) => (
                  <LandingPage {...props} userState={userState} />
                )}
              />
            )}

            {userState[0].loggedIn ? (
              <Route
                path='/editproject/:projectID'
                render={(props) => (
                  <EditProjectPage {...props} userState={userState} />
                )}
              />
            ) : (
              <Route
                path='/'
                render={(props) => (
                  <LandingPage {...props} userState={userState} />
                )}
              />
            )}

            {/* Catch all path */}
            <Route
              path='/'
              render={(props) => (
                <LandingPage {...props} userState={userState} />
              )}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default HDRRouter;
