import React from 'react';
import { Container, Row, Col } from 'react-bootstrap/';
import SearchBar from './searchBar/SearchBar';

var cmsURL = require('../commonComponents/BaseURL').getCMSURL();

class LoginErrorPage extends React.Component {
    state = {
        userState: [
            {
                loggedIn: false,
                role: 'Reader',
                id: null,
                name: null,
            },
        ],
        searchString: '',
    };

    constructor(props) {
        super(props);
        this.state.userState = props.userState;
    }

    doSearch = e => {
        //fires on enter on searchbar
        if (e.key === 'Enter') window.location.href = `/search?search=${encodeURIComponent(this.state.searchString)}`;
    };

    render() {
        const { searchString, userState } = this.state;

        return (
            <div>
                <SearchBar
                    searchString={searchString}
                    doSearchMethod={this.doSearch}
                    doUpdateSearchString={this.updateSearchString}
                    userState={userState}
                />
                <Container className='mb-5'>
                    <Row className='mt-2'>
                        <Col>
                            <div className='rectangle'>
                                <div className='gray800-14' style={{ textAlign: 'center' }}>
                                    Sorry, we have been unable to log you in at the current time.
                                    <br />
                                    <br />
                                    Please wait a few minutes before trying again.
                                    <br />
                                    <br />
                                    If this issue continues, please contact support by clicking{' '}
                                    <a href={cmsURL + '/HDRUKGatewaySupportPortal'}>here.</a>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default LoginErrorPage;
