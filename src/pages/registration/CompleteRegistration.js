import React, { Component } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Row, Col, Container, Button, Alert, Form, InputGroup } from 'react-bootstrap';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import Loading from '../commonComponents/Loading';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer'; 
import UserMessages from "../commonComponents/userMessages/UserMessages";
import DataSetModal from "../commonComponents/dataSetModal/DataSetModal";
import 'react-tabs/style/react-tabs.css';

var baseURL = require('../commonComponents/BaseURL').getURL();

class CompleteRegistration extends Component {

    constructor(props) {
        super(props);
        this.searchBar = React.createRef();
    }

    state = {
        searchString: '',
        id: '',
        userdata: [],
        isLoading: true,
        showDrawer: false,
        userState: [{
            loggedIn: false,
            role: "Reader",
            id: null,
            name: null
        }],
        showModal: false,
        context: {}
    };

    doSearch = (e) => { //fires on enter on searchbar
        if (e.key === 'Enter') window.location.href = "/search?search=" + this.state.searchString;
    }

    updateSearchString = (searchString) => {
        this.setState({ searchString: searchString });
    }

    toggleDrawer = () => {
        this.setState( ( prevState ) => {
            if(prevState.showDrawer === true) {
                this.searchBar.current.getNumberOfUnreadMessages();
            }
            return { showDrawer: !prevState.showDrawer };
        });
    }

    toggleModal = (showEnquiry = false, context = {}) => {
        this.setState( ( prevState ) => {
            return { showModal: !prevState.showModal, context, showDrawer: showEnquiry };
        });
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        axios.get(baseURL + '/api/v1/auth/register/' + this.props.match.params.personID)
            .then((res) => {
            this.setState({
                userdata: res.data.data,
                isLoading: false
            });
        })
    }

    render() {
        const { isLoading, searchString, userState, userdata, showDrawer, showModal, context } = this.state;
        
        if (isLoading) {
            return <Container><Loading /></Container>;
        }

        return (
            <div>
                <SearchBar ref={this.searchBar} searchString={searchString} doSearchMethod={this.doSearch} doUpdateSearchString={this.updateSearchString} doToggleDrawer={this.toggleDrawer} userState={userState} />

                <Container className="mb-5">

                    <Row className="mt-3">
                        <Col sm={1} lg={1} />
                        <Col sm={10} lg={10}>
                            <div>
                                <YourAccountForm userdata={userdata} />
                            </div>
                        </Col>
                        <Col sm={1} lg={1} />
                    </Row>
                </Container>
                <SideDrawer
                    open={showDrawer}
                    closed={this.toggleDrawer}>
                    <UserMessages 
                        closed={this.toggleDrawer}
                        toggleModal={this.toggleModal}
                        drawerIsOpen={this.state.showDrawer} 
                    />
                </SideDrawer>

                <DataSetModal 
                    open={showModal} 
                    context={context}
                    closed={this.toggleModal}
                    userState={userState[0]} 
                />
            </div>
        );
    }
}

//Your Account Form

const YourAccountForm = (props) => {
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
            id: props.userdata.id,
            firstname: props.userdata.firstname,
            lastname: props.userdata.lastname,
            email: props.userdata.email,
            bio: '',
            link: '',
            orcid: '',
            redirectURL: props.userdata.redirectURL,
            emailNotifications: false,
            terms: false
        },

        validationSchema: Yup.object({
            firstname: Yup.string()
                .required('This cannot be empty'),
            lastname: Yup.string()
                .required('This cannot be empty'),
            email: Yup.string()
                .email('This must be a valid email')
                .required('This cannot be empty'),
            bio: Yup.string()
                .required('This cannot be empty'),
            terms: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required')
        }),
        
        onSubmit: values => {
            //alert(JSON.stringify(values, null, 2));
            axios.post(baseURL + '/api/v1/auth/register', values)
            .then((res) => {
                const url = `${window.location.search}${res.data.data}`;
                window.location.href = `${url}${url.includes('?') ? '&': '?' }registrationCompleted=true`;
            });
        }
    });

    return (

        <div>
            {props.isUpdated ? <Alert variant="success" className="mt-3">Done! Your account details have been updated</Alert> : ""}
            <Row className="mt-2">
                <Col>
                    <div className="rectangle">
                        <p className="black-20">Your details</p>
                        <p className="gray800-14">We need some more details to create your account</p>
                    </div>
                </Col>
            </Row>
            <Form onSubmit={formik.handleSubmit}>
                <Row className="mt-1">
                    <Col>
                        <div className="rectangle">
                            <Form.Group className="pb-2">
                                <Form.Label className="gray800-14">First name</Form.Label>
                                <Form.Control id="firstname" name="firstname" type="text" className={formik.touched.firstname && formik.errors.firstname ? "emptyFormInput addFormInput" : "addFormInput"} onChange={formik.handleChange} value={formik.values.firstname} onBlur={formik.handleBlur} />
                                {formik.touched.firstname && formik.errors.firstname ? <div className="errorMessages">{formik.errors.firstname}</div> : null}
                            </Form.Group>

                            <Form.Group className="pb-2">
                                <Form.Label className="gray800-14">Last name</Form.Label>
                                <Form.Control id="lastname" name="lastname" type="text" className={formik.touched.lastname && formik.errors.lastname ? "emptyFormInput addFormInput" : "addFormInput"} onChange={formik.handleChange} value={formik.values.lastname} onBlur={formik.handleBlur} />
                                {formik.touched.lastname && formik.errors.lastname ? <div className="errorMessages">{formik.errors.lastname}</div> : null}
                            </Form.Group>

                            <Form.Group className="pb-2">
                                <Form.Label className="gray800-14">Email</Form.Label>
                                <Form.Control id="email" name="email" type="text" className={formik.touched.email && formik.errors.email ? "emptyFormInput addFormInput" : "addFormInput"} onChange={formik.handleChange} value={formik.values.email} onBlur={formik.handleBlur} />
                                {formik.touched.email && formik.errors.email ? <div className="errorMessages">{formik.errors.email}</div> : null}
                            </Form.Group>

                            <Form.Group className="pb-2">
                                <span className="gray800-14">Institution</span>
                                <br />
                                <span className="gray700-13">If you aren't part of an institution, please provide a short description of who you are</span>
                                <Form.Control id="bio" name="bio" type="text" className={formik.touched.bio && formik.errors.bio ? "emptyFormInput addFormInput" : "addFormInput"} onChange={formik.handleChange} value={formik.values.bio} onBlur={formik.handleBlur} />
                                {formik.touched.bio && formik.errors.bio ? <div className="errorMessages">{formik.errors.bio}</div> : null}
                            </Form.Group>

                            <Form.Group className="pb-2">
                                <span className="gray800-14">Link (optional)</span>
                                <br />
                                <span className="gray700-13">Social media, research gate, anywhere that people can go to find out more about you</span>
                                <Form.Control id="link" name="link" type="text" className="addFormInput" onChange={formik.handleChange} value={formik.values.link} onBlur={formik.handleBlur} />
                            </Form.Group>

                            <Form.Group className="pb-2">
                                <span className="gray800-14">ORCID (optional)</span>
                                <br />
                                <span className="gray700-13">Your unique ORCID identifier</span>
                                <Form.Control id="orcid" name="orcid" type="text" className="addFormInput" onChange={formik.handleChange} value={formik.values.orcid} onBlur={formik.handleBlur} />
                            </Form.Group>

                            <Form.Group className="pb-2">
                                <InputGroup.Checkbox aria-label="Checkbox for following text input" name="emailNotifications" onChange={formik.handleChange} checked={formik.values.emailNotifications}/>
                                <span className="gray800-14 ml-4">I want to receive email notifications about activity relating to my account or content</span>
                            </Form.Group>
                            
                            <Form.Group className="pb-2">
                                <InputGroup.Checkbox aria-label="Checkbox for following text input" name="terms" onChange={formik.handleChange} checked={formik.values.terms}/>
                                <span className="gray800-14 ml-4">I agree to the HDRUK <a href='https://www.hdruk.ac.uk/infrastructure/gateway/terms-and-conditions/' target="_blank" rel="noopener noreferrer">Terms and Conditions</a></span>
                                {formik.touched.terms && formik.errors.terms ? <div className="errorMessages">{formik.errors.terms}</div> : null}
                            </Form.Group>

                        </div>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col className="text-right">
                        <Button variant="primary" type="submit" className="addButton">
                            Update Details
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default CompleteRegistration;