import React from 'react';
import * as Yup from 'yup';

import { Row, Col, Button, Alert, Form, InputGroup } from 'react-bootstrap';

import { useFormik } from 'formik';
import queryString from 'query-string';
import Loading from '../commonComponents/Loading'
import { axiosIG } from '../../utils/axios.util';

class YourAccount extends React.Component {

    constructor(props) {
        super(props)
        this.state.userState = props.userState;
    }

    // initialize our state
    state = {
        data: [],
        userdata: [],
        userState: [],
        isLoading: true,
        isUpdated: false,
    };

    componentDidMount() {
        if (!!window.location.search) {
            var values = queryString.parse(window.location.search);
            this.setState({ isUpdated: values.accountUpdated });
        }
        this.doYourAccountCall();
    }

    doYourAccountCall() {
        axiosIG.get('/api/v1/person/' + this.state.userState[0].id)
            .then((res) => {
                axiosIG.get('/api/v1/users/' + this.state.userState[0].id)
                    .then((resUser) => {
                        this.setState({
                            userdata: resUser.data.userdata[0],
                            data: res.data.data[0],
                            isLoading: false
                        });
                    })
            })
    }

    render() {
        const { data, isLoading, isUpdated, userdata } = this.state;
        
        if (isLoading) {
            return (
                <Row className="mt-4">
                    <Col xs={1}></Col>
                    <Col xs={10}>
                        <Loading />
                    </Col>
                    <Col xs={1}></Col>
                </Row> 
            );
        }

        return (
            <div>
                <Row className="mt-4">
                    <Col xs={1}></Col>
                    <Col xs={10}>
                        <YourAccountForm data={data} userdata={userdata} isUpdated={isUpdated} />
                    </Col>
                    <Col xs={1}></Col>
                </Row>    
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
            id: props.data.id,
            type: 'person',
            firstname: props.data.firstname,
            lastname: props.data.lastname,
            email: props.userdata.email,
            bio: props.data.bio,
            link: props.data.link,
            orcid: props.data.orcid,
            emailNotifications: props.data.emailNotifications || false, 
            terms: props.data.terms || false
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
            axiosIG.put('/api/v1/person', values)
                .then((res) => {
                    window.location.href = '/account?tab=youraccount&accountUpdated=true';
                });
        }
    });
    
    return (
        <div>
            {props.isUpdated ? <Alert variant="success" className="mt-3">Done! Your account details have been updated</Alert> : ""}
            <Row className="pixelGapBottom">
                <Col>
                    <div className="rectangle">
                        <p className="black-20">Add or edit your account details</p>
                        <p className="gray800-14">Your details are visible to other users, with the exception of your email address</p>
                    </div>
                </Col>
            </Row>
            <Form onSubmit={formik.handleSubmit}>
                <Row>
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
                            
                            {/* <InputGroup.Checkbox aria-label="Checkbox for following text input" name="toolCategory" checked={projectCategoriesSelected.indexOf(category) !== -1 ? "true" : ""} value={category} onChange={this.changeFilter} /> */}

                            <Form.Group className="pb-2">
                                <InputGroup.Checkbox aria-label="Checkbox for following text input" name="emailNotifications" onChange={formik.handleChange} checked={formik.values.emailNotifications}/>
                                <span className="gray800-14 ml-4">I want to receive email notifications about activity relating to my account or content</span>
                            </Form.Group>
                            
                            <Form.Group className="pb-2">
                                <InputGroup.Checkbox aria-label="Checkbox for following text input" name="terms" onChange={formik.handleChange} checked={formik.values.terms}/>
                                <span className="gray800-14 ml-4">I agree to the HDRUK <a href='https://www.hdruk.ac.uk/infrastructure/gateway/terms-and-conditions/' target="_blank">Terms and Conditions</a></span>
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

export default YourAccount;