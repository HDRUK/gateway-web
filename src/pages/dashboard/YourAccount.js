import React from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form';
import { useFormik } from 'formik';
import queryString from 'query-string';
import Loading from '../commonComponents/Loading'

var baseURL = require('../commonComponents/BaseURL').getURL();

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
        axios.get(baseURL + '/api/v1/person/' + this.state.userState[0].id)
            .then((res) => {
                axios.get(baseURL + '/api/v1/users/' + this.state.userState[0].id)
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
            return <Loading />;
        }

        return (
            <div>
                <YourAccountForm data={data} userdata={userdata} isUpdated={isUpdated} />
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
        },

        onSubmit: values => {
            axios.post(baseURL + '/api/v1/person/edit', values)
                .then((res) => {
                    window.location.href = '/account?tab=youraccount&accountUpdated=true';
                });
        }
    });

    return (

        <div>
            {props.isUpdated ? <Alert variant="success" className="mt-3">Done! Your account details have been updated</Alert> : ""}
            <Row className="mt-2">
                <Col>
                    <div className="Rectangle">
                        <p className="Black-20px">Add or edit your account details</p>
                        <p className="Gray800-14px">Your details are visible to other users, with the exception of your email address</p>
                    </div>
                </Col>
            </Row>
            <Form onSubmit={formik.handleSubmit}>
                <Row className="mt-2">
                    <Col>
                        <div className="Rectangle">
                            <Form.Group className="pb-2">
                                <Form.Label className="Gray800-14px">First Name</Form.Label>
                                <Form.Control id="firstname" name="firstname" type="text" className="AddFormInput" value={formik.values.firstname} disabled />
                            </Form.Group>

                            <Form.Group className="pb-2">
                                <Form.Label className="Gray800-14px">Last Name</Form.Label>
                                <Form.Control id="lastname" name="lastname" type="text" className="AddFormInput" value={formik.values.lastname} disabled />
                            </Form.Group>

                            <Form.Group className="pb-2">
                                <Form.Label className="Gray800-14px">Email</Form.Label>
                                <Form.Control id="email" name="email" type="text" className="AddFormInput" value={formik.values.email} disabled />
                            </Form.Group>

                            <Form.Group className="pb-2">
                                <span className="Gray800-14px">Bio (optional)</span>
                                <br />
                                <span className="Gray700-13px">This can be the name of your institution or a short description of who you are</span>
                                <Form.Control id="bio" name="bio" type="text" className="AddFormInput" onChange={formik.handleChange} value={formik.values.bio} onBlur={formik.handleBlur} />
                            </Form.Group>

                            <Form.Group className="pb-2">
                                <span className="Gray800-14px">Link (optional)</span>
                                <br />
                                <span className="Gray700-13px">Social media, research gate, anywhere that people can go to find out more about you</span>
                                <Form.Control id="link" name="link" type="text" className="AddFormInput" onChange={formik.handleChange} value={formik.values.link} onBlur={formik.handleBlur} />
                            </Form.Group>

                            <Form.Group className="pb-2">
                                <span className="Gray800-14px">ORCID (optional)</span>
                                <br />
                                <span className="Gray700-13px">Your unique ORCID identifier</span>
                                <Form.Control id="orcid" name="orcid" type="text" className="AddFormInput" onChange={formik.handleChange} value={formik.values.orcid} onBlur={formik.handleBlur} />
                            </Form.Group>

                        </div>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col className="text-right">
                        <Button variant="primary" type="submit" className="AddButton">
                            Update Details
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default YourAccount;