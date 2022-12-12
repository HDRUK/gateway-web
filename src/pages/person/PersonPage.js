import React, { useState, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import axios from 'axios';
import PersonTitle from './components/PersonTitle';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import DataSet from '../commonComponents/DataSet';
import Tool from '../commonComponents/Tool';
import MessageNotFound from '../commonComponents/MessageNotFound';
import ReviewsTitle from '../commonComponents/ReviewTitle';
import Loading from '../commonComponents/Loading';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../commonComponents/errorModal';
import _ from 'lodash';
let baseURL = require('../commonComponents/BaseURL').getURL();

const PersonDetail = props => {
    const [searchString, setSearchString] = useState('');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userState] = useState(
        props.userState || [
            {
                loggedIn: false,
                role: 'Reader',
                id: null,
                firstName: null,
            },
        ]
    );
    const [showDrawer, setShowDrawer] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [context, setContext] = useState({});
    const [searchBar] = useState(React.createRef());

    useEffect(() => {
        getDataSearchFromDb();
    }, []);

    const getDataSearchFromDb = () => {
        setIsLoading(true);

        axios.get(baseURL + '/api/v1/person/' + props.match.params.personID).then(res => {
            if (_.isNil(res.data)) {
                window.localStorage.setItem('redirectMsg', `Person not found for Id: ${props.match.params.personID}`);
                props.history.push({ pathname: '/search?search=', search: '' });
            } else {
                let { person = {} } = res.data;
                person = {
                    ...person,
                    datasetids: person.datasetids || [],
                };
                setData(person);
                setIsLoading(false);
            }
        });
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

    if (isLoading) {
        return (
            <Container>
                <Loading />
            </Container>
        );
    }

    let tools = [];
    let reviews = [];

    if (data.tools.length > 0) {
        data.tools.forEach(object => {
            if (
                (object.type === 'tool' && object.activeflag === 'active') ||
                (object.type === 'tool' && object.activeflag === 'review' && object.authors.includes(userState[0].id))
            ) {
                tools.push(object);
            }
        });
    }

    reviews =
        data.reviews.length > 0
            ? data.reviews.filter(review => {
                  return review.activeflag === 'active';
              })
            : [];

    return (
        <Sentry.ErrorBoundary fallback={<ErrorModal />}>
            <div>
                <SearchBar
                    ref={searchBar}
                    searchString={searchString}
                    doSearchMethod={doSearch}
                    doUpdateSearchString={updateSearchString}
                    doToggleDrawer={toggleDrawer}
                    userState={userState}
                />
                <Container className='mb-5'>
                    <PersonTitle data={data} activeLink={true} />

                    <Row className='mt-3'>
                        <Col sm={1} lg={1} />
                        <Col sm={10} lg={10}>
                            <div>
                                <Tabs className='tabsBackground gray700-13'>
                                    <Tab eventKey='Tools' title={'Tools (' + tools.length + ')'}>
                                        {tools.length <= 0 ? (
                                            <MessageNotFound word='tools' />
                                        ) : (
                                            tools.map(tool => {
                                                return <Tool id={tool.id} activeLink={true} />;
                                            })
                                        )}
                                    </Tab>
                                    <Tab eventKey='Reviews' title={'Reviews (' + reviews.length + ')'}>
                                        {reviews.length <= 0 ? (
                                            <MessageNotFound word='reviews' />
                                        ) : (
                                            reviews.map(review => {
                                                return <ReviewsTitle id={review.reviewID} />;
                                            })
                                        )}
                                    </Tab>
                                    <Tab eventKey='Data sets' title={'Data sets (' + data.datasetids.length + ')'}>
                                        {data.datasetids.length <= 0 ? (
                                            <MessageNotFound word='data sets' />
                                        ) : (
                                            data.datasetids.map(id => <DataSet id={id} activeLink={true} />)
                                        )}
                                    </Tab>
                                </Tabs>
                            </div>
                        </Col>
                        <Col sm={1} lg={1} />
                    </Row>
                </Container>
                <SideDrawer open={showDrawer} closed={toggleDrawer}>
                    <UserMessages userState={userState[0]} closed={toggleDrawer} toggleModal={toggleModal} drawerIsOpen={showDrawer} />
                </SideDrawer>

                <DataSetModal open={showModal} context={context} closed={toggleModal} userState={userState[0]} />
            </div>
        </Sentry.ErrorBoundary>
    );
};

export default PersonDetail;
