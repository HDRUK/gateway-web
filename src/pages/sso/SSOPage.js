import React, { Component } from 'react';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import axios from 'axios';
import * as Sentry from '@sentry/react';
import ErrorModal from '../commonComponents/errorModal';
import './SSOPage.scss';

const baseURL = require('../commonComponents/BaseURL').getURL();

class SSOPage extends Component {
    state = {
        userState: [
            {
                loggedIn: false,
                role: 'Reader',
                id: null,
                name: null,
            },
        ],
        renderPage: false,
        searchString: '',
    };

    constructor(props) {
        super(props);
        if (props.userState) {
            this.state.userState = props.userState;
        }
    }

    componentDidMount() {
        const url = `${window.location.search}`;
        axios
            .get(`${baseURL}/api/v1/auth/sso/discourse${url}`)
            .then(res => {
                if (res.status === 200 && res.data.redirectUrl) {
                    window.location.href = res.data.redirectUrl;
                } else {
                    this.setState({ renderPage: true });
                    this.showLogin();
                }
            })
            .catch(err => {
                this.setState({ renderPage: true });
                this.showLogin();
            });
    }

    showLogin() {
        document.getElementById('myModal').style.display = 'block';
        document.getElementById('loginWayFinder').style.display = 'none';
        document.getElementById('loginButtons').style.display = 'block';
        document.getElementById('loginModalTitle').innerHTML = 'Sign in or create a new account';
        document.getElementById('modalRequestSection').style.display = 'none';
    }

    doSearch = e => {
        //fires on enter on searchbar
        if (e.key === 'Enter') window.location.href = `/search?search=${encodeURIComponent(this.state.searchString)}`;
    };

    updateSearchString = searchString => {
        this.setState({ searchString: searchString });
    };

    render() {
        const { renderPage, userState } = this.state;

        return (
            renderPage && (
                <Sentry.ErrorBoundary fallback={<ErrorModal />}>
                    <SearchBar
                        ref={this.searchBar}
                        doSearchMethod={this.doSearch}
                        doUpdateSearchString={this.updateSearchString}
                        doToggleDrawer={this.toggleDrawer}
                        userState={userState}
                    />
                    <div className='landingBackground' />
                </Sentry.ErrorBoundary>
            )
        );
    }
}

export default SSOPage;
