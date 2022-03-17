import React, { Fragment, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { Row, Col, Button, Alert, Form, DropdownButton, Dropdown } from 'react-bootstrap';
import { useFormik } from 'formik';
import { Typeahead } from 'react-bootstrap-typeahead';
import queryString from 'query-string';
import Loading from '../commonComponents/Loading';
import './Dashboard.scss';
import SVGIcon from '../../images/SVGIcon';
import AlertBannerBlue from '../commonComponents/AlertBannerBlue';
import TextareaAutosize from 'react-textarea-autosize';

var baseURL = require('../commonComponents/BaseURL').getURL();

class YourAccount extends React.Component {
    // initialize our state
    state = {
        data: [],
        userdata: [],
        userState: [],
        topicData: [],
        isLoading: true,
        accountUpdated: false,
        showOrg: true,
        combinedOrganisations: [],
        showSector: true,
        showOrganisation: true,
        showBio: true,
        showDomain: true,
        showLink: true,
        showOrcid: true,
        profileComplete: null,
    };

    constructor(props) {
        super(props);
        this.state.userState = props.userState;
        this.state.accountUpdated = props.accountUpdated;
    }

    componentDidMount() {
        if (!!window.location.search) {
            var values = queryString.parse(window.location.search);
            this.setState({ isUpdated: values.accountUpdated });
        }
        this.getAccountDetails();
        this.doFilterCall();
        this.doOrganisationsCall();
    }

    getAccountDetails() {
        axios.get(baseURL + '/api/v1/person/profile/' + this.state.userState[0].id).then(res => {
            axios.get(baseURL + '/api/v1/users/' + this.state.userState[0].id).then(resUser => {
                let showOrg = true;
                this.setState({
                    userdata: resUser.data.userdata[0],
                    data: res.data.data[0],
                    profileComplete: res.data.data[0].profileComplete,
                    isLoading: false,
                    showOrg,
                    //we want undefined to default to true
                    showSector: res.data.data[0].showSector === false ? false : true,
                    showOrganisation: res.data.data[0].showOrganisation === false ? false : true,
                    showBio: res.data.data[0].showBio === false ? false : true,
                    showDomain: res.data.data[0].showDomain === false ? false : true,
                    showLink: res.data.data[0].showLink === false ? false : true,
                    showOrcid: res.data.data[0].showOrcid === false ? false : true,
                });
            });
        });
    }

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

    render() {
        const {
            data,
            isLoading,
            isUpdated,
            userdata,
            profileComplete,
            topicData,
            showOrg,
            combinedOrganisations,
            showBio,
            showSector,
            showDomain,
            showLink,
            showOrcid,
            showOrganisation,
            accountUpdated,
        } = this.state;

        if (isLoading) {
            return (
                <Row>
                    <Col xs={1}></Col>
                    <Col xs={10}>
                        <Loading />
                    </Col>
                    <Col xs={1}></Col>
                </Row>
            );
        }

        return (
            <Fragment>
                <Row>
                    <Col xs={1}></Col>
                    <Col xs={10}>
                        <YourAccountForm
                            data={data}
                            userdata={userdata}
                            isUpdated={isUpdated}
                            profileComplete={profileComplete}
                            accountUpdated={accountUpdated}
                            topicData={topicData}
                            combinedOrganisations={combinedOrganisations}
                            showOrg={showOrg}
                            showOrganisation={showOrganisation}
                            showBio={showBio}
                            showSector={showSector}
                            showDomain={showDomain}
                            showLink={showLink}
                            showOrcid={showOrcid}
                        />
                    </Col>
                    <Col xs={1}></Col>
                </Row>
            </Fragment>
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

    let profileComplete = props.profileComplete;
    let initialTerms = props.data.terms || false;
    let optInFeedback = props.data.feedback || false;
    let optInNews = props.data.news || false;

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
            id: props.data.id,
            type: 'person',
            profileComplete: true,
            firstname: props.data.firstname,
            lastname: props.data.lastname,
            email: props.userdata.email,
            bio: props.data.bio || '',
            link: props.data.link || '',
            orcid: props.data.orcid || '',
            feedback: optInFeedback || false,
            news: optInNews || false,
            terms: initialTerms || false,
            sector: props.data.sector || '',
            organisation: props.data.organisation || '',
            showOrgVal: props.showOrgVal,
            tags: props.data.tags.topics ? { topics: props.data.tags.topics } : { topics: [] },
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
            axios.put(baseURL + '/api/v1/person', values).then(res => {
                window.location.href = '/account?tab=youraccount&accountUpdated=true';
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
            {initialTerms ? (
                ''
            ) : (
                <Row className='accountBanner'>
                    <Col className='pad-left-24'>Please accept the updated Terms and Conditions and update your profile details.</Col>
                </Row>
            )}
            {props.profileComplete ? (
                ''
            ) : (
                <AlertBannerBlue
                    className='margin-bottom-12'
                    message='Our new account page allows you to easily update your preferences regarding participating in feedback and receiving our
				newsletter.'
                />
            )}
            {props.accountUpdated ? <Alert variant='success'>Done! Your account details have been updated</Alert> : ''}
            <AlertBannerBlue
                message='Want to get involved in shaping the Gateway? Join our development and improvement group.'
                href='https://discourse.healthdatagateway.org/t/about-the-development-and-improvement-group/498'
                dataTestId='dev-and-improvement'
            />
            <Row className='pixelGapBottom margin-top-24'>
                <Col>
                    <div className='rectangle pad-bottom-2'>
                        <p className='black-20 mb-0'>Your details</p>
                        <p className='gray800-14'>
                            You can control what appears on your profile using the icons. Your details are also used when you make a data
                            access request application.
                        </p>
                    </div>
                </Col>
            </Row>
            <Form onSubmit={formik.handleSubmit}>
                <Row>
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
                                            className={
                                                formik.touched.firstname && formik.errors.firstname
                                                    ? 'emptyFormInput addFormInput'
                                                    : 'addFormInput'
                                            }
                                            onChange={formik.handleChange}
                                            value={formik.values.firstname}
                                            onBlur={formik.handleBlur}
                                            data-test-id='user-account-first-name'
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
                                    <div className='errorMessages' data-test-id='user-account-first-name-validation'>
                                        {formik.errors.firstname}
                                    </div>
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
                                            data-test-id='user-account-last-name'
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
                                    <div className='errorMessages' data-test-id='user-account-last-name-validation'>
                                        {formik.errors.lastname}
                                    </div>
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
                                            data-test-id='user-account-email-address'
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
                                    <div className='errorMessages' data-test-id='user-account-email-address-validation'>
                                        {formik.errors.email}
                                    </div>
                                ) : null}
                            </Form.Group>

                            <Form.Group className='pb-2 form-group'>
                                <Form.Label className='gray800-14'>Sector</Form.Label>
                                <br />
                                <span className='gray700-13'>Select one of the sectors your work falls under below</span>
                                <Row>
                                    <Col sm={4} lg={4}>
                                        <DropdownButton
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
                                            id='user-account-sector'
                                        >
                                            {sectorSelect.map((sec, i) => (
                                                <Dropdown.Item
                                                    className='gray800-14 width-100'
                                                    key={sec}
                                                    eventKey={sec}
                                                    data-test-id={`user-account-sector-option-${i}`}
                                                >
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
                                    <div className='errorMessages margin-top-8' data-test-id='user-account-sector-validation'>
                                        {formik.errors.sector}
                                    </div>
                                ) : null}
                            </Form.Group>

                            <Form.Group className='margin-bottom-0'>
                                <Form.Label className='gray800-14'>Organisation (optional)</Form.Label>
                                <br />
                                <Fragment>
                                    <span className='gray700-13'>Your affiliation or company, if applicable</span>
                                    <Form.Group>
                                        <Row>
                                            <Col sm={11} lg={11} data-test-id='user-account-organisation'>
                                                <Typeahead
                                                    id='organisation'
                                                    name='organisation'
                                                    labelKey='organisation'
                                                    allowNew
                                                    defaultSelected={[formik.values.organisation] || ''}
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
                                        {props.showOrg &&
                                        formik.touched.organisation &&
                                        formik.values.organisation === '' &&
                                        formik.errors.organisation &&
                                        typeof formik.errors.organisation !== 'undefined' ? (
                                            <div className='errorMessages' data-test-id='user-account-organisation-validation'>
                                                {formik.errors.organisation}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                    </Form.Group>
                                </Fragment>
                            </Form.Group>
                            <Form.Group className='pb-2'>
                                <Form.Label className='gray800-14'>Bio (optional)</Form.Label>
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
                                            data-test-id='user-account-bio'
                                        />
                                        {formik.touched.bio && formik.errors.bio ? (
                                            <div className='errorMessages' data-test-id='user-account-bio-validation'>
                                                {formik.errors.bio}
                                            </div>
                                        ) : null}
                                    </Col>
                                    <Col
                                        sm={1}
                                        lg={1}
                                        className='eyeColumn'
                                        onMouseEnter={() => setBioHover(true)}
                                        onMouseLeave={() => setBioHover(false)}
                                    >
                                        {inBioHover && (
                                            <div className='accountClassToolTip'>
                                                <span className='white-13-semibold'>
                                                    {showingBio ? optionalShowFieldMsg : optionalHideFieldMsg}
                                                </span>
                                            </div>
                                        )}
                                        <button
                                            className='eye'
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
                                    <Col sm={11} lg={11} data-test-id='user-account-domain'>
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
                                            data-test-id='user-account-link'
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
                                            data-test-id='user-account-orcid'
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
                                        default={profileComplete ? formik.values.emailNotifications : false}
                                        checked={formik.values.terms}
                                        onChange={formik.handleChange}
                                        data-test-id='user-account-terms-conditions'
                                    />
                                    <span className='gray800-14 ml-4 margin-top-2'>
                                        I agree to the HDRUK{' '}
                                        <a
                                            href='https://www.hdruk.ac.uk/infrastructure/gateway/terms-and-conditions/'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            data-test-id='user-account-terms-conditions-link'
                                        >
                                            Terms and Conditions
                                        </a>
                                    </span>
                                </Row>
                                <Row className='mt-2'>
                                    {formik.touched.terms && formik.errors.terms ? (
                                        <div
                                            className='errorMessages margin-left-16'
                                            data-test-id='user-account-terms-conditions-validation'
                                        >
                                            {formik.errors.terms}
                                        </div>
                                    ) : null}
                                </Row>
                            </Form.Group>
                        </div>

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
                                            name='feedback'
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
                                            name='news'
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
                                    aims to give you information on how Health Data Research UK collects and processes your personal data
                                    through your use of this Gateway, including any data you may provide by emailing us.
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row className='mt-3 mb-5'>
                    <Col className='text-right'>
                        <Button
                            variant='medium'
                            className='dark-14 mr-2'
                            onClick={e => {
                                window.location.href = `/person/${props.userdata.id}`;
                            }}
                            data-test-id='user-account-view-profile'
                        >
                            View my profile
                        </Button>
                        <Button variant='primary' type='submit' className='addButton' data-test-id='user-account-save-changes'>
                            Save changes
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default YourAccount;
