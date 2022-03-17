import React, { Component, Fragment, useState, useRef } from 'react';
import axios from 'axios';
import * as Sentry from '@sentry/react';
import { useFormik } from 'formik';
import { Typeahead } from 'react-bootstrap-typeahead';
import * as Yup from 'yup';
import { Row, Col, Container, Button, Alert, Form, DropdownButton, Dropdown } from 'react-bootstrap';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import Loading from '../commonComponents/Loading';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../commonComponents/errorModal';
import googleAnalytics from '../../tracking';
import 'react-tabs/style/react-tabs.css';
import SVGIcon from '../../images/SVGIcon';
import TextareaAutosize from 'react-textarea-autosize';

const baseURL = require('../commonComponents/BaseURL').getURL();
let windowUrl = window.location.origin;

class CompleteRegistration extends Component {
    constructor(props) {
        super(props);
        this.searchBar = React.createRef();
    }

    state = {
        searchString: '',
        userdata: [],
        isLoading: true,
        showDrawer: false,
        userState: [
            {
                loggedIn: false,
                role: 'Reader',
                id: null,
                name: null,
            },
        ],
        showModal: false,
        context: {},
        combinedOrganisations: [],
        showSector: true,
        showOrganisation: true,
        showBio: true,
        showDomain: true,
        showLink: true,
        showOrcid: true,
    };

    doSearch = e => {
        //fires on enter on searchbar
        if (e.key === 'Enter') window.location.href = `/search?search=${encodeURIComponent(this.state.searchString)}`;
    };

    updateSearchString = searchString => {
        this.setState({ searchString: searchString });
    };

    toggleDrawer = () => {
        this.setState(prevState => {
            if (prevState.showDrawer === true) {
                this.searchBar.current.getNumberOfUnreadMessages();
            }
            return { showDrawer: !prevState.showDrawer };
        });
    };

    toggleModal = (showEnquiry = false, context = {}) => {
        this.setState(prevState => {
            return { showModal: !prevState.showModal, context, showDrawer: showEnquiry };
        });
    };

    doFilterCall() {
        axios
            .get(baseURL + '/api/v1/search/filter/topic/person')
            .then(res => {
                this.setState({
                    topicData: res.data.data[0],
                });
            })
            .catch(err => {
                console.error(err.message);
            });
    }

    doOrganisationsCall() {
        return new Promise((resolve, reject) => {
            axios.get(baseURL + '/api/v1/search/filter/organisation/person').then(res => {
                var tempOrganisationsArray = [
                    'Genomics England',
                    'Health Data Research UK',
                    'Lancaster University',
                    'PA Consulting',
                    'Queens University Belfast',
                    'University College London',
                    'University of Portsmouth',
                    'University of Ulster',
                ];

                res.data.data[0].forEach(la => {
                    if (!tempOrganisationsArray.includes(la) && la !== '') {
                        tempOrganisationsArray.push(la);
                    }
                });

                this.setState({
                    combinedOrganisations: tempOrganisationsArray.sort(function (a, b) {
                        return a.toUpperCase() < b.toUpperCase() ? -1 : a.toUpperCase() > b.toUpperCase() ? 1 : 0;
                    }),
                });
                resolve();
            });
        });
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.doFilterCall();
        this.doOrganisationsCall();
        axios.get(baseURL + '/api/v1/auth/register/' + this.props.match.params.personID).then(res => {
            this.setState({
                userdata: res.data.data,
                isLoading: false,
            });
        });
    }

    render() {
        const {
            isLoading,
            searchString,
            userState,
            userdata,
            showDrawer,
            showModal,
            context,
            topicData,
            showBio,
            showSector,
            showDomain,
            showLink,
            showOrcid,
            showOrganisation,
            combinedOrganisations,
        } = this.state;

        if (isLoading) {
            return (
                <Container>
                    <Loading data-testid='isLoading' />
                </Container>
            );
        }

        return (
            <Sentry.ErrorBoundary fallback={<ErrorModal />}>
                <div>
                    <SearchBar
                        ref={this.searchBar}
                        searchString={searchString}
                        doSearchMethod={this.doSearch}
                        doUpdateSearchString={this.updateSearchString}
                        doToggleDrawer={this.toggleDrawer}
                        userState={userState}
                        data-testid='searchBar'
                    />

                    <Container className='mb-5'>
                        <Row className='mt-3'>
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10}>
                                <div>
                                    <YourAccountForm
                                        userdata={userdata}
                                        topicData={topicData}
                                        showOrganisation={showOrganisation}
                                        showBio={showBio}
                                        showSector={showSector}
                                        showDomain={showDomain}
                                        showLink={showLink}
                                        showOrcid={showOrcid}
                                        combinedOrganisations={combinedOrganisations}
                                        data-testid='your-account'
                                    />
                                </div>
                            </Col>
                            <Col sm={1} lg={1} />
                        </Row>
                    </Container>
                    <SideDrawer open={showDrawer} closed={this.toggleDrawer}>
                        <UserMessages
                            userState={userState[0]}
                            closed={this.toggleDrawer}
                            toggleModal={this.toggleModal}
                            drawerIsOpen={this.state.showDrawer}
                        />
                    </SideDrawer>

                    <DataSetModal open={showModal} context={context} closed={this.toggleModal} userState={userState[0]} />
                </div>
            </Sentry.ErrorBoundary>
        );
    }
}

const sectorSelect = ['NHS', 'Industry', 'Academia', 'Public', 'Charity/Non-profit'];

//Your Account Form

const YourAccountForm = props => {
    //Set initial state
    let showSector = props.showSector;
    let showOrg = props.showOrganisation;
    let showBio = props.showBio;
    let showDomain = props.showDomain;
    let showLink = props.showLink;
    let showOrcid = props.showOrcid;
    let btnRef = useRef();

    //tool tips for eyes
    const mandatoryShowFieldMsg = 'This will be visible to others. You cannot change this.';
    const mandatoryHideFieldMsg = 'This will not be visible to others. You cannot change this.';
    const optionalShowFieldMsg = 'This will be visible to others. Click to hide from your profile.';
    const optionalHideFieldMsg = 'This will not be visible to others. Click to show on your profile.';

    //hover state for eyes
    const [inFirstNameHover, setFirstNameHover] = useState(false);
    const [inLastNameHover, setLastNameHover] = useState(false);
    const [inEmailHover, setEmailHover] = useState(false);
    const [inSectorHover, setSectorHover] = useState(false);
    const [inOrgHover, setOrgHover] = useState(false);
    const [inBioHover, setBioHover] = useState(false);
    const [inDomainHover, setDomainHover] = useState(false);
    const [inLinkHover, setLinkHover] = useState(false);
    const [inOrcidHover, setOrcidHover] = useState(false);

    //define toggle for each hideable field
    //set default value on page load based on value taken from state
    //Updates the corresponding key in formik
    const [showingSector, setShowSector] = useState(showSector);
    const toggleSector = () => {
        setShowSector(!showingSector);

        formik.setFieldValue('showSector', !showingSector);
    };
    const [showingOrg, setShowOrg] = useState(showOrg);
    const toggleOrg = () => {
        setShowOrg(!showingOrg);

        formik.setFieldValue('showOrganisation', !showingOrg);
    };
    const [showingBio, setShowBio] = useState(showBio);
    const toggleBio = () => {
        setShowBio(!showingBio);

        formik.setFieldValue('showBio', !showingBio);
    };
    const [showingDomain, setShowDomain] = useState(showDomain);
    const toggleDomain = () => {
        setShowDomain(!showingDomain);

        formik.setFieldValue('showDomain', !showingDomain);
    };
    const [showingLink, setShowLink] = useState(showLink);
    const toggleLink = () => {
        setShowLink(!showingLink);

        formik.setFieldValue('showLink', !showingLink);
    };
    const [showingOrcid, setShowOrcid] = useState(showOrcid);
    const toggleOrcid = () => {
        setShowOrcid(!showingOrcid);

        formik.setFieldValue('showOrcid', !showingOrcid);
    };

    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
            id: props.userdata.id,
            firstname: props.userdata.firstname,
            lastname: props.userdata.lastname,
            email: props.userdata.email,
            profileComplete: true,
            bio: '',
            link: '',
            orcid: '',
            redirectURL: props.userdata.redirectURL,
            feedback: false,
            news: false,
            terms: false,
            sector: '',
            organisation: '',
            showOrg: props.showOrg,
            tags: { topics: [] },
            showSector: showingSector,
            showOrganisation: showingOrg,
            showBio: showingBio,
            showLink: showingLink,
            showOrcid: showingOrcid,
            showDomain: showingDomain,
        },

        validationSchema: Yup.object({
            firstname: Yup.string().required('This cannot be empty'),
            lastname: Yup.string().required('This cannot be empty'),
            email: Yup.string().email('This must be a valid email').required('This cannot be empty'),
            bio: Yup.string().max(500, 'Maximum of 500 characters'),
            terms: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required'),
            sector: Yup.string().required('Please select a sector'),
        }),

        onSubmit: values => {
            if (btnRef.current) {
                btnRef.current.setAttribute('disabled', 'disabled');
            }

            axios.post(baseURL + '/api/v1/auth/register', values).then(res => {
                googleAnalytics.recordEvent('User accounts', 'New user registered', 'Clicked complete registration button');
                const url = `${windowUrl}${res.data.data}`;
                window.location.href = `${url}${url.includes('?') ? '&' : '?'}registrationCompleted=true`;
            });
        },
    });

    const handleSectorSelect = key => {
        formik.setFieldValue('sector', key);
    };

    function bioCount(e) {
        document.getElementById('bioCurrentCount').innerHTML = e.target.value.length;
    }

    return (
        <div>
            {props.isUpdated ? (
                <Alert variant='success' className='mt-3'>
                    Done! Your account details have been updated
                </Alert>
            ) : (
                ''
            )}
            <Row className='mt-2'>
                <Col>
                    <div className='rectangle'>
                        <p className='black-20' data-testid='your-details'>
                            Your details
                        </p>
                        <p className='gray800-14'>
                            You can control what appears on your profile using the icons. Your details are also used when you make a data
                            access request application.
                        </p>
                    </div>
                </Col>
            </Row>
            <Form onSubmit={formik.handleSubmit} data-testid='form'>
                <Row className='mt-1'>
                    <Col>
                        <div className='rectangle pb-1'>
                            <Form.Group className='pb-2'>
                                <Form.Label className='gray800-14'>First name</Form.Label>
                                <Row>
                                    <Col sm={11} lg={11}>
                                        <Form.Control
                                            id='firstname'
                                            name='firstname'
                                            type='text'
                                            data-testid='first-name'
                                            className={
                                                formik.touched.firstname && formik.errors.firstname
                                                    ? 'emptyFormInput addFormInput'
                                                    : 'addFormInput'
                                            }
                                            onChange={formik.handleChange}
                                            value={formik.values.firstname}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Col>
                                    <Col
                                        sm={1}
                                        lg={1}
                                        className='eyeColumn'
                                        onMouseEnter={() => setFirstNameHover(true)}
                                        onMouseLeave={() => setFirstNameHover(false)}
                                    >
                                        {inFirstNameHover && (
                                            <div className='accountClassToolTip'>
                                                <span className='white-13-semibold'>{mandatoryShowFieldMsg}</span>
                                            </div>
                                        )}
                                        <button className='eye' disabled={true}>
                                            <SVGIcon name='eye' width={24} height={24} fill={'#475da7'} className={'pointer, eyeFaded'} />
                                        </button>
                                    </Col>
                                </Row>
                                {formik.touched.firstname && formik.errors.firstname ? (
                                    <div className='errorMessages'>{formik.errors.firstname}</div>
                                ) : null}
                            </Form.Group>

                            <Form.Group className='pb-2'>
                                <Form.Label className='gray800-14'>Last name</Form.Label>
                                <Row>
                                    <Col sm={11} lg={11}>
                                        <Form.Control
                                            id='lastname'
                                            name='lastname'
                                            type='text'
                                            className={
                                                formik.touched.lastname && formik.errors.lastname
                                                    ? 'emptyFormInput addFormInput'
                                                    : 'addFormInput'
                                            }
                                            onChange={formik.handleChange}
                                            value={formik.values.lastname}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Col>
                                    <Col
                                        sm={1}
                                        lg={1}
                                        className='eyeColumn'
                                        onMouseEnter={() => setLastNameHover(true)}
                                        onMouseLeave={() => {
                                            setLastNameHover(false);
                                        }}
                                    >
                                        {inLastNameHover && (
                                            <div className='accountClassToolTip'>
                                                <span className='white-13-semibold'>{mandatoryShowFieldMsg}</span>
                                            </div>
                                        )}
                                        <button className='eye' disabled={true}>
                                            <SVGIcon name='eye' width={24} height={24} fill={'#475da7'} className={'pointer, eyeFaded'} />
                                        </button>
                                    </Col>
                                </Row>
                                {formik.touched.lastname && formik.errors.lastname ? (
                                    <div className='errorMessages'>{formik.errors.lastname}</div>
                                ) : null}
                            </Form.Group>

                            <Form.Group className='pb-2'>
                                <Form.Label className='gray800-14'>Email</Form.Label>
                                <Row>
                                    <Col sm={11} lg={11}>
                                        <Form.Control
                                            id='email'
                                            name='email'
                                            type='text'
                                            className={
                                                formik.touched.email && formik.errors.email ? 'emptyFormInput addFormInput' : 'addFormInput'
                                            }
                                            onChange={formik.handleChange}
                                            value={formik.values.email}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Col>
                                    <Col
                                        sm={1}
                                        lg={1}
                                        className='eyeColumn'
                                        onMouseEnter={() => setEmailHover(true)}
                                        onMouseLeave={() => setEmailHover(false)}
                                    >
                                        {inEmailHover && (
                                            <div className='accountClassToolTip'>
                                                <span className='white-13-semibold'>{mandatoryHideFieldMsg}</span>
                                            </div>
                                        )}
                                        <button className='eye' disabled={true}>
                                            <SVGIcon
                                                name='eyeCrossed'
                                                width={24}
                                                height={24}
                                                fill={'#868e96'}
                                                className={'pointer, eyeFaded'}
                                            />
                                        </button>
                                    </Col>
                                </Row>
                                {formik.touched.email && formik.errors.email ? (
                                    <div className='errorMessages'>{formik.errors.email}</div>
                                ) : null}
                            </Form.Group>

                            <Form.Group className='pb-2'>
                                <Form.Label className='gray800-14'>Sector</Form.Label>
                                <br />
                                <span className='gray700-13'>Select one of the sectors your work falls under below</span>
                                <Row>
                                    <Col sm={4} lg={4}>
                                        <DropdownButton
                                            data-testid='dropdown-button'
                                            variant='white'
                                            title={
                                                formik.values.sector ? (
                                                    <>
                                                        <div className='sectorValueInFront'>
                                                            <select className='hiddenSelectBox'></select>
                                                        </div>
                                                        <div className='sectorValue'>{formik.values.sector}</div>
                                                    </>
                                                ) : (
                                                    <select className='hiddenSelectBox'></select>
                                                )
                                            }
                                            className={
                                                formik.touched.sector && formik.errors.sector
                                                    ? 'emptyFormInput  gray800-14 custom-dropdown margin-top-8 padding-right-0'
                                                    : 'gray700-13 custom-dropdown margin-top-8 padding-right-0'
                                            }
                                            onChange={selected => {
                                                formik.setFieldValue('sector', selected.target.value);
                                            }}
                                            value={formik.values.sector}
                                            onBlur={() => formik.setFieldTouched('sector', true)}
                                            touched={formik.touched.sector}
                                            onSelect={selected => handleSectorSelect(selected)}
                                        >
                                            {sectorSelect.map((sec, i) => (
                                                <Dropdown.Item className='gray800-14 width-100' key={sec} eventKey={sec}>
                                                    {sec}
                                                </Dropdown.Item>
                                            ))}
                                        </DropdownButton>
                                    </Col>
                                    <Col
                                        sm={1}
                                        lg={1}
                                        className='eyeColumn'
                                        onMouseEnter={() => setSectorHover(true)}
                                        onMouseLeave={() => setSectorHover(false)}
                                    >
                                        {inSectorHover && (
                                            <div className='accountClassToolTip accountSectorToolTip'>
                                                <span className='white-13-semibold'>
                                                    {showingSector ? optionalShowFieldMsg : optionalHideFieldMsg}
                                                </span>
                                            </div>
                                        )}
                                        <button
                                            className='eye'
                                            onClick={e => {
                                                e.preventDefault();
                                                toggleSector();
                                            }}
                                        >
                                            {showingSector ? (
                                                <SVGIcon name='eye' width={24} height={24} fill={'#475da7'} className={'pointer'} />
                                            ) : (
                                                <SVGIcon name='eyeCrossed' width={24} height={24} fill={'#868e96'} className={'pointer'} />
                                            )}
                                        </button>
                                    </Col>
                                </Row>
                                {formik.touched.sector && formik.errors.sector ? (
                                    <div className='errorMessages'>{formik.errors.sector}</div>
                                ) : null}
                            </Form.Group>

                            <Form.Group className='margin-bottom-0'>
                                <Form.Label className='gray800-14'>Organisation (optional)</Form.Label>
                                <br />
                                <Fragment>
                                    <span className='gray700-13'>Your affiliation or company, if applicable</span>
                                    <Form.Group>
                                        <Row>
                                            <Col sm={11} lg={11}>
                                                <Typeahead
                                                    id='organisation'
                                                    name='organisation'
                                                    labelKey='organisation'
                                                    data-testid='typeahead'
                                                    allowNew
                                                    defaultSelected={formik.values.organisation ? [formik.values.organisation] : ''}
                                                    options={props.combinedOrganisations}
                                                    className={'sectorTypeahead addFormInput margin-bottom-8 margin-top-8'}
                                                    onBlur={formik.handleBlur}
                                                    onChange={selected => {
                                                        var tempSelected = [];
                                                        selected.forEach(selectedItem => {
                                                            selectedItem.customOption === true
                                                                ? tempSelected.push(selectedItem.organisation)
                                                                : tempSelected.push(selectedItem);
                                                        });
                                                        tempSelected.length > 0
                                                            ? (formik.values.organisation = tempSelected[0])
                                                            : (formik.values.organisation = '');
                                                        formik.setFieldTouched('organisation', true);
                                                    }}
                                                />
                                            </Col>
                                            <Col
                                                sm={1}
                                                lg={1}
                                                className='eyeColumn'
                                                onMouseEnter={() => setOrgHover(true)}
                                                onMouseLeave={() => setOrgHover(false)}
                                            >
                                                {inOrgHover && (
                                                    <div className='accountClassToolTip accountSectorToolTip'>
                                                        <span className='white-13-semibold'>
                                                            {showingOrg ? optionalShowFieldMsg : optionalHideFieldMsg}
                                                        </span>
                                                    </div>
                                                )}
                                                <button
                                                    className='eye'
                                                    data-testid='eye-icon'
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        toggleOrg();
                                                    }}
                                                >
                                                    {showingOrg ? (
                                                        <SVGIcon name='eye' width={24} height={24} fill={'#475da7'} className={'pointer'} />
                                                    ) : (
                                                        <SVGIcon
                                                            name='eyeCrossed'
                                                            width={24}
                                                            height={24}
                                                            fill={'#868e96'}
                                                            className={'pointer'}
                                                        />
                                                    )}
                                                </button>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Fragment>
                            </Form.Group>

                            <Form.Group className='pb-2'>
                                <span className='gray800-14'>Bio (optional)</span>
                                <br />
                                <Row>
                                    <Col sm={11} lg={11}>
                                        <span className='gray700-13'>Please provide a short description of who you are</span>
                                        <span className='gray700-13 floatRight'>/500)</span>
                                        <span id='bioCurrentCount' className='gray700-13 floatRight'>
                                            ({formik.values.bio.length || 0}
                                        </span>
                                    </Col>
                                    <Col sm={1} lg={1}></Col>
                                </Row>
                                <Row>
                                    <Col sm={11} lg={11}>
                                        <TextareaAutosize
                                            as='textarea'
                                            id='bio'
                                            name='bio'
                                            type='text'
                                            className={
                                                formik.touched.bio && formik.errors.bio
                                                    ? 'emptyFormInput addFormInput descriptionInput textarea-addEditForm'
                                                    : 'addFormInput descriptionInput textarea-addEditForm'
                                            }
                                            onChange={formik.handleChange}
                                            value={formik.values.bio}
                                            onBlur={formik.handleBlur}
                                            onKeyUp={bioCount}
                                        />
                                        {formik.touched.bio && formik.errors.bio ? (
                                            <div className='errorMessages'>{formik.errors.bio}</div>
                                        ) : null}
                                    </Col>
                                    <Col sm={1} lg={1} className='eyeColumn'>
                                        {inBioHover && (
                                            <div className='accountClassToolTip'>
                                                <span className='white-13-semibold'>
                                                    {showingBio ? optionalShowFieldMsg : optionalHideFieldMsg}
                                                </span>
                                            </div>
                                        )}
                                        <button
                                            className='eye'
                                            onMouseEnter={() => setBioHover(true)}
                                            onMouseLeave={() => setBioHover(false)}
                                            onClick={e => {
                                                e.preventDefault();
                                                toggleBio();
                                            }}
                                        >
                                            {showingBio ? (
                                                <SVGIcon name='eye' width={24} height={24} fill={'#475da7'} className={'pointer'} />
                                            ) : (
                                                <SVGIcon name='eyeCrossed' width={24} height={24} fill={'#868e96'} className={'pointer'} />
                                            )}
                                        </button>
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group className='pb-2'>
                                <Form.Label className='gray800-14'>Domain (optional)</Form.Label>
                                <br />
                                <Row>
                                    <Col sm={11} lg={11}>
                                        <Typeahead
                                            id='tags.topics'
                                            labelKey='topics'
                                            allowNew
                                            defaultSelected={formik.values.tags.topics}
                                            multiple
                                            options={props.topicData}
                                            className='addFormInputTypeAhead'
                                            onChange={selected => {
                                                var tempSelected = [];
                                                selected.forEach(selectedItem => {
                                                    selectedItem.customOption === true
                                                        ? tempSelected.push(selectedItem.topics)
                                                        : tempSelected.push(selectedItem);
                                                });
                                                formik.values.tags.topics = tempSelected;
                                            }}
                                        />
                                    </Col>
                                    <Col
                                        sm={1}
                                        lg={1}
                                        className='eyeColumn'
                                        onMouseEnter={() => setDomainHover(true)}
                                        onMouseLeave={() => setDomainHover(false)}
                                    >
                                        {inDomainHover && (
                                            <div className='accountClassToolTip'>
                                                <span className='white-13-semibold'>
                                                    {showingDomain ? optionalShowFieldMsg : optionalHideFieldMsg}
                                                </span>
                                            </div>
                                        )}
                                        <button
                                            className='eye'
                                            onClick={e => {
                                                e.preventDefault();
                                                toggleDomain();
                                            }}
                                        >
                                            {showingDomain ? (
                                                <SVGIcon name='eye' width={24} height={24} fill={'#475da7'} className={'pointer'} />
                                            ) : (
                                                <SVGIcon name='eyeCrossed' width={24} height={24} fill={'#868e96'} className={'pointer'} />
                                            )}
                                        </button>
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group className='pb-2'>
                                <span className='gray800-14'>Link (optional)</span>
                                <br />
                                <span className='gray700-13'>
                                    Social media, research gate, anywhere that people can go to find out more about you
                                </span>
                                <Row>
                                    <Col sm={11} lg={11}>
                                        <Form.Control
                                            id='link'
                                            name='link'
                                            type='text'
                                            className='addFormInput'
                                            onChange={formik.handleChange}
                                            value={formik.values.link}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Col>
                                    <Col
                                        sm={1}
                                        lg={1}
                                        className='eyeColumn'
                                        onMouseEnter={() => setLinkHover(true)}
                                        onMouseLeave={() => setLinkHover(false)}
                                    >
                                        {inLinkHover && (
                                            <div className='accountClassToolTip'>
                                                <span className='white-13-semibold'>
                                                    {showingLink ? optionalShowFieldMsg : optionalHideFieldMsg}
                                                </span>
                                            </div>
                                        )}
                                        <button
                                            className='eye'
                                            onClick={e => {
                                                e.preventDefault();
                                                toggleLink();
                                            }}
                                        >
                                            {showingLink ? (
                                                <SVGIcon name='eye' width={24} height={24} fill={'#475da7'} className={'pointer'} />
                                            ) : (
                                                <SVGIcon name='eyeCrossed' width={24} height={24} fill={'#868e96'} className={'pointer'} />
                                            )}
                                        </button>
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group className='pb-2'>
                                <span className='gray800-14'>ORCID (optional)</span>
                                <br />
                                <span className='gray700-13'>Your unique ORCID identifier</span>
                                <Row>
                                    <Col sm={11} lg={11}>
                                        <Form.Control
                                            id='orcid'
                                            name='orcid'
                                            type='text'
                                            className='addFormInput'
                                            onChange={formik.handleChange}
                                            value={formik.values.orcid}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Col>
                                    <Col
                                        sm={1}
                                        lg={1}
                                        className='eyeColumn'
                                        onMouseEnter={() => setOrcidHover(true)}
                                        onMouseLeave={() => setOrcidHover(false)}
                                    >
                                        {inOrcidHover && (
                                            <div className='accountClassToolTip'>
                                                <span className='white-13-semibold'>
                                                    {showingOrcid ? optionalShowFieldMsg : optionalHideFieldMsg}
                                                </span>
                                            </div>
                                        )}
                                        <button
                                            className='eye'
                                            onClick={e => {
                                                e.preventDefault();
                                                toggleOrcid();
                                            }}
                                        >
                                            {showingOrcid ? (
                                                <SVGIcon name='eye' width={24} height={24} fill={'#475da7'} className={'pointer'} />
                                            ) : (
                                                <SVGIcon name='eyeCrossed' width={24} height={24} fill={'#868e96'} className={'pointer'} />
                                            )}
                                        </button>
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group className='pb-2'>
                                <Row className='mt-2'>
                                    <Form.Control
                                        type='checkbox'
                                        className='checker'
                                        id='terms'
                                        name='terms'
                                        checked={formik.values.terms}
                                        onChange={formik.handleChange}
                                    />
                                    <span className='gray800-14 ml-4 margin-top-2'>
                                        I agree to the HDRUK{' '}
                                        <a
                                            href='https://www.hdruk.ac.uk/infrastructure/gateway/terms-and-conditions/'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                        >
                                            Terms and Conditions
                                        </a>
                                    </span>
                                </Row>
                                <Row className='mt-2'>
                                    {formik.touched.terms && formik.errors.terms ? (
                                        <div className='errorMessages margin-left-16'>{formik.errors.terms}</div>
                                    ) : null}
                                </Row>
                            </Form.Group>
                        </div>
                    </Col>
                </Row>

                <div className='rectangle margin-top-16'>
                    <Row className='mt-2 '>
                        <span className='divider-lines' />
                        <Col sm={12} className='gray800-14-bold'>
                            Keeping you updated
                        </Col>
                    </Row>
                    <Form.Group>
                        <Row className='mt-2 gray800-14'>
                            <span className='divider-lines' />
                            <Col md={1} sm={2} xs={3}>
                                Feedback
                            </Col>
                            <Col md={1} sm={2} xs={3}>
                                <Form.Control
                                    type='checkbox'
                                    className='checker'
                                    id='feedback'
                                    checked={formik.values.feedback}
                                    onChange={formik.handleChange}
                                    data-test-id='user-account-feedback'
                                />
                            </Col>
                            <Col md={10} sm={8} xs={6} className='gray800-14 pl-0'>
                                I am happy to be contacted to share and give feedback on my experience with the Gateway
                            </Col>
                        </Row>
                    </Form.Group>

                    <Form.Group>
                        <Row className='mt-2 gray800-14'>
                            <span className='divider-lines' />
                            <Col md={1} sm={2} xs={3}>
                                News
                            </Col>
                            <Col md={1} sm={2} xs={3}>
                                <Form.Control
                                    type='checkbox'
                                    className='checker'
                                    id='news'
                                    checked={formik.values.news}
                                    onChange={formik.handleChange}
                                    data-test-id='user-account-news'
                                />
                            </Col>
                            <Col md={10} sm={8} xs={6} className='gray800-14 pl-0'>
                                I want to receive news, updates and curated marketing from the Gateway&nbsp;&nbsp;&nbsp;&nbsp;
                                <a
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    href='https://mailchi.mp/hdruk.ac.uk/explore-and-access-the-uks-health-research-datasets'
                                >
                                    Show me an example
                                </a>
                            </Col>
                        </Row>
                    </Form.Group>

                    <Row className='gray800-14 margin-top-2'>
                        <span className='divider-lines' />
                        <Col sm={12}>
                            As a user of the Gateway we take the privacy and security of your personal data seriously. Our{' '}
                            <a
                                target='_blank'
                                rel='noopener noreferrer'
                                href='https://www.hdruk.ac.uk/infrastructure/gateway/privacy-policy/'
                            >
                                privacy policy
                            </a>{' '}
                            aims to give you information on how Health Data Research UK collects and processes your personal data through
                            your use of this Gateway, including any data you may provide by emailing us.
                        </Col>
                    </Row>
                </div>

                <Row className='mt-3'>
                    <Col className='text-right'>
                        <Button ref={btnRef} variant='primary' type='submit' className='addButton'>
                            Update Details
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default CompleteRegistration;
