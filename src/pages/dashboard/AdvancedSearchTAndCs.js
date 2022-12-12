import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import AdvancedSearchTAndCsContent from './AdvancedSearchTAndCsContent';
import './AdvancedSearchTAndCsModal.scss';
import { Fragment } from 'react';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';

const AdvancedSearchTAndCs = props => {
    const [searchString, setSearchString] = useState('');
    const [searchBar] = useState(React.createRef());
    const [showDrawer, setShowDrawer] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [context, setContext] = useState({});
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

    return (
        <Fragment>
            <SearchBar
                ref={searchBar}
                searchString={searchString}
                doSearchMethod={doSearch}
                doUpdateSearchString={updateSearchString}
                doToggleDrawer={toggleDrawer}
                userState={userState}
            />
            <div>
                <Container className='mb-5'>
                    <Row className='mt-3'>
                        <Col sm={1} lg={1} />
                        <Col sm={10} lg={10}>
                            <div className='advancedSearchTAndCModal'>
                                <div className='black-20 pad-bottom-24'>HDR Discovery Tool Terms of Use</div>
                                <AdvancedSearchTAndCsContent></AdvancedSearchTAndCsContent>
                            </div>
                        </Col>
                        <Col sm={1} lg={1} />
                    </Row>
                </Container>
            </div>

            <SideDrawer open={showDrawer} closed={toggleDrawer}>
                <UserMessages userState={userState[0]} closed={toggleDrawer} toggleModal={toggleModal} drawerIsOpen={showDrawer} />
            </SideDrawer>

            <DataSetModal open={showModal} context={context} closed={toggleModal} userState={userState[0]} />
        </Fragment>
    );
};

export default AdvancedSearchTAndCs;
