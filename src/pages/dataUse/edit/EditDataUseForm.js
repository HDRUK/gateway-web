import { FieldArray, Formik, useFormik } from 'formik';
import { isEmpty, isNil, isNumber } from 'lodash';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { Accordion, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import DatePicker from 'react-datepicker';
import * as Yup from 'yup';
import { NotificationManager } from 'react-notifications';
import { ReactComponent as Calendar } from '../../../images/calendaricon.svg';
import SVGIcon from '../../../images/SVGIcon';
import ActionBar from '../../commonComponents/actionbar/ActionBar';
import RelatedObject from '../../commonComponents/relatedObject/RelatedObject';
import RelatedResources from '../../commonComponents/relatedResources/RelatedResources';

import dataUseRegistersService from '../../../services/data-use-registers';

const baseURL = require('../../commonComponents/BaseURL').getURL();

const windowUrl = window.location.origin;

const EditFormDataUse = props => {
    const initalLaySummary = props && props.data && props.data.laySummary && props.data.laySummary.length;

    const [laySummaryCounter, setLaySummaryCounter] = useState(initalLaySummary);
    const [safePeople, setSafePeople] = useState(false);
    const [safeProject, setSafeProject] = useState(true);
    const [safeData, setSafeData] = useState(true);
    const [safeSettings, setSafeSettings] = useState(true);
    const [safeOutput, setSafeOutput] = useState(true);
    const [keywords, setKeywords] = useState(true);
    const [relatedResources, setRelatedResources] = useState(true);
    const [safeOuputsList] = useState(props.safeOuputsList);
    const [safeOuputsArray] = useState(props.safeOuputsArray);
    const [applicantsList, setApplicantsList] = useState(props.applicantsList);
    const [applicantsArray] = useState(props.applicantsArray);
    const [datasetsList] = useState(props.datasetsList);
    const [datasetsArray] = useState(props.datasetsArray);
    const [disableInput] = useState(props.disableInput);

    const dataUseRegisterUpdate = dataUseRegistersService.usePatchDataUseRegister(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    useEffect(() => {
        buildListOfUploaders();
    }, []);

    const initialValues = {
        safeOuputsArray: [{ id: '', name: '' }],
    };

    const gatewayApps =
        props &&
        props.data &&
        props.data.gatewayApplicants &&
        props.data.gatewayApplicants.map(a => ({ label: a, value: a, type: 'gateway', icon: 'personiconwithbg' }));

    const nonGatewayApps =
        props &&
        props.data &&
        props.data.nonGatewayApplicants &&
        props.data.nonGatewayApplicants.map(b => ({ label: b, value: b, type: 'nongateway' }));

    const laySummaryCount = e => {
        setLaySummaryCounter(e.target.value.length);
    };

    function updateReason(id, reason, type, pid) {
        let inRelatedObject = false;
        props.relatedObjects.map(object => {
            if (object.objectId === id) {
                inRelatedObject = true;
                object.pid = pid;
                object.reason = reason;
                object.objectType = type;
                object.user = props.userState[0].name;
                object.updated = moment().format('DD MMM YYYY');
            }
        });

        if (!inRelatedObject) {
            props.relatedObjects.push({
                objectId: id,
                pid,
                reason,
                objectType: type,
                user: props.userState[0].name,
                updated: moment().format('DD MMM YYYY'),
            });
        }
    }

    const buildListOfUploaders = () => {
        const listOfApplicants = [];

        props.applicantsList.forEach(user => {
            if (user.id === props.userState[0].id) {
                listOfApplicants.push({ id: user.id, name: `${user.name} (You)` });
                if (!user.name.includes('(You)')) {
                    user.name += ' (You)';
                }
            } else {
                listOfApplicants.push({ id: user.id, name: user.name });
            }
        });

        setApplicantsList(listOfApplicants);
    };

    const validateSchema = Yup.object().shape({});

    const relatedResourcesRef = React.useRef();

    const formik = useFormik({
        initialValues: {
            organisationName: props.data.organisationName || '',
            organisationId: props.data.organisationId || '',
            organisationSector: props.data.organisationSector || '',
            applicantId: props.data.applicantId || '',
            fundersAndSponsors: props.data.fundersAndSponsors.join(', ') || '',
            sublicenceArrangements: props.data.sublicenceArrangements || '',
            accreditedResearcherStatus: props.data.accreditedResearcherStatus || '',
            projectIdText: props.data.projectIdText || '',
            projectTitle: props.data.projectTitle || '',
            laySummary: props.data.laySummary || '',
            publicBenefitStatement: props.data.publicBenefitStatement || '',
            requestCategoryType: props.data.requestCategoryType || '',
            technicalSummary: props.data.technicalSummary || '',
            otherApprovalCommittees: props.data.otherApprovalCommittees.join(', ') || '',
            projectStartDate: props.data.projectStartDate || '',
            projectEndDate: props.data.projectEndDate || '',
            latestApprovalDate: props.data.latestApprovalDate || '',
            dataSensitivityLevel: props.data.dataSensitivityLevel || '',
            legalBasisForDataArticle6: props.data.legalBasisForDataArticle6 || '',
            legalBasisForDataArticle9: props.data.legalBasisForDataArticle9 || '',
            dutyOfConfidentiality: props.data.dutyOfConfidentiality || '',
            nationalDataOptOut: props.data.nationalDataOptOut || '',
            requestFrequency: props.data.requestFrequency || '',
            datasetLinkageDescription: props.data.datasetLinkageDescription || '',
            confidentialDataDescription: props.data.confidentialDataDescription || '',
            accessDate: props.data.accessDate || '',
            accessType: props.data.accessType || '',
            privacyEnhancements: props.data.privacyEnhancements || '',
            safeOutput: safeOuputsArray || [{ id: '', name: '' }],
            applicants: applicantsArray || [{ id: '', name: '' }],
            datasets: datasetsArray || [{ pid: '', name: '' }],
            keywords: props.data.keywords || [],
        },

        validationSchema: Yup.object({
            organisationName: Yup.string().required('This cannot be empty'),
            projectTitle: Yup.string().required('This cannot be empty'),
            datasets: Yup.string().required('This cannot be empty'),
        }),

        onSubmit: values => {
            const gatewayApplicantsArray = [];
            const nonGatewayApplicants = [];
            values.applicants.forEach(applicant => {
                if (applicant.id === 'nonGateway') nonGatewayApplicants.push(applicant.name);
                else gatewayApplicantsArray.push(applicant.id);
            });

            const gatewayDatasetsArray = [];
            const nonGatewayDatasets = [];
            values.datasets.forEach(dataset => {
                if (dataset.pid === 'nonGateway') nonGatewayDatasets.push(dataset.name);
                else gatewayDatasetsArray.push(dataset.pid);
            });

            const gatewayOutputsArray = [];
            const nonGatewayOutputs = [];
            values.safeOutput.forEach(output => {
                if (output.id === 'nonGateway') nonGatewayOutputs.push(output.name);
                else gatewayOutputsArray.push(output.id);
            });

            values.gatewayApplicants = gatewayApplicantsArray;
            values.nonGatewayApplicants = nonGatewayApplicants;
            values.gatewayDatasets = gatewayDatasetsArray;
            values.nonGatewayDatasets = nonGatewayDatasets;
            values.gatewayOutputs = gatewayOutputsArray;
            values.nonGatewayOutputs = nonGatewayOutputs;

            values.relatedObjects = props.relatedObjects;
            values.datasetTitles = props.data.datasetTitles;

            dataUseRegisterUpdate.mutateAsync({ _id: props.data.id, ...values }).then(() => {
                window.location.href = `${windowUrl}/datause/${props.data.id}/?dataUseEdited=true`;
            });
        },
    });

    const yesNoList = ['', 'Yes', 'No'];
    const yesNoNotList = ['', 'Yes', 'No', 'Not applicable'];
    const organisationSectorList = [
        '',
        'Academic Institute',
        'CQC Registered Health or/and Social Care provider',
        'Independent Sector Organisation',
        'Government Agency (Health and Adult Social Care)',
        'Commercial',
        'Local authority',
        'Government Agency (Other)',
    ];
    const requestCategoryTypeList = [
        '',
        'Efficacy & Mechanism Evaluation',
        'Health Services & Delivery',
        'Health Technology Assessment',
        'Public Health Research',
        'Other',
    ];
    const dataSensitivityLevelList = ['', 'Personally Identifiable', 'De-Personalised', 'Anonymous'];
    const legalBasisForDataArticle6List = [
        '',
        'Not applicable',
        '(a) the data subject has given consent to the processing of his or her personal data for one or more specific purposes;',
        '(b) processing is necessary for the performance of a contract to which the data subject is party or in order to take steps at the request of the data subject prior to entering into a contract;',
        '(c)processing is necessary for compliance with a legal obligation to which the controller is subject;',
        '(d) processing is necessary in order to protect the vital interests of the data subject or of another natural person;',
        '(e) processing is necessary for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller;',
        '(f) processing is necessary for the purposes of the legitimate interests pursued by the controller or by a third party, except where such interests are overridden by the interests or fundamental rights and freedoms of the data subject which require protection of personal data, in particular where the data subject is a child.',
    ];
    const legalBasisForDataArticle9List = [
        '',
        'Not applicable',
        '(a) the data subject has given explicit consent to the processing of those personal data for one or more specified purposes, except where Union or Member State law provide that the prohibition referred to in paragraph 1 may not be lifted by the data subject;',
        '(b) processing is necessary for the purposes of carrying out the obligations and exercising specific rights of the controller or of the data subject in the field of employment and social security and social protection law in so far as it is authorised by Union or Member State law or a collective agreement pursuant to Member State law providing for appropriate safeguards for the fundamental rights and the interests of the data subject;',
        '(c)processing is necessary to protect the vital interests of the data subject or of another natural person where the data subject is physically or legally incapable of giving consent;',
        '(d) processing is carried out in the course of its legitimate activities with appropriate safeguards by a foundation, association or any other not-for-profit body with a political, philosophical, religious or trade union aim and on condition that the processing relates solely to the members or to former members of the body or to persons who have regular contact with it in connection with its purposes and that the personal data are not disclosed outside that body without the consent of the data subjects;',
        '(e) processing relates to personal data which are manifestly made public by the data subject;',
        '(f) processing is necessary for the establishment, exercise or defence of legal claims or whenever courts are acting in their judicial capacity;',
        '(g) processing is necessary for reasons of substantial public interest, on the basis of Union or Member State law which shall be proportionate to the aim pursued, respect the essence of the right to data protection and provide for suitable and specific measures to safeguard the fundamental rights and the interests of the data subject;',
        '(h) processing is necessary for the purposes of preventive or occupational medicine, for the assessment of the working capacity of the employee, medical diagnosis, the provision of health or social care or treatment or the management of health or social care systems and services on the basis of Union or Member State law or pursuant to contract with a health professional and subject to the conditions and safeguards referred to in paragraph 3;',
        '(i) processing is necessary for reasons of public interest in the area of public health, such as protecting against serious cross-border threats to health or ensuring high standards of quality and safety of health care and of medicinal products or medical devices, on the basis of Union or Member State law which provides for suitable and specific measures to safeguard the rights and freedoms of the data subject, in particular professional secrecy;',
        '(j) processing is necessary for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes in accordance with Article 89(1) based on Union or Member State law which shall be proportionate to the aim pursued, respect the essence of the right to data protection and provide for suitable and specific measures to safeguard the fundamental rights and the interests of the data subject.',
    ];
    const requestFrequencyList = ['', 'One-off', 'Recurring'];
    const dutyOfConfidentialityList = ['', 'Not applicable', 'Consent', 'Section 251 NHS Act 2006', 'Other'];
    const accessTypeList = ['', 'TRE', 'Release'];

    return (
        <div>
            <div className='container'>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    render={() => {
                        return (
                            <div>
                                <Row className='margin-top-32'>
                                    <Col sm={1} lg={1} />
                                    <Col sm={10} lg={10}>
                                        <div className='rectangle'>
                                            <Row>
                                                <Col sm={10} lg={10}>
                                                    <p className='black-20 margin-bottom-0 pad-bottom-8'>Edit a data use</p>
                                                </Col>
                                                <Col sm={2} lg={2} className='text-right'>
                                                    <span className='badge-datause'>
                                                        <SVGIcon
                                                            name='datauseicon'
                                                            fill='#fff'
                                                            className='badgeSvg mr-2'
                                                            viewBox='-2 -2 22 22'
                                                        />
                                                        Data use
                                                    </span>
                                                </Col>
                                            </Row>
                                            <p className='gray800-14 margin-bottom-0'>
                                                A data use register is a public record of data an organisation has shared with other
                                                individuals and organisations. Data uses help people understand how data is being used and
                                                why. Please edit data uses to ensure that the information is accurate and up-to-date
                                            </p>
                                        </div>
                                    </Col>
                                    <Col sm={1} lg={10} />
                                </Row>
                                <Row className='pixelGapTop'>
                                    <Col sm={1} lg={1} />
                                    <Col sm={10} lg={10}>
                                        <div className='rectangle'>
                                            <Accordion defaultActiveKey='0' className='datause-accordion-header'>
                                                <Card className='edit-datause-card'>
                                                    <Accordion.Toggle as={Button} variant='link' eventKey='0'>
                                                        <Card.Header
                                                            className='datause-accordion saved-search-arrow'
                                                            onClick={() => (!safePeople ? setSafePeople(true) : setSafePeople(false))}>
                                                            <SVGIcon
                                                                width='20px'
                                                                height='20px'
                                                                name='chevronbottom'
                                                                fill='#fff'
                                                                className={safePeople ? 'edit-datause-arrow' : 'flip180 edit-datause-arrow'}
                                                            />
                                                            Safe People
                                                        </Card.Header>
                                                    </Accordion.Toggle>
                                                    <Accordion.Collapse className='datause-accordion-collapse' eventKey='0'>
                                                        <Card.Body className='datause-card-body'>
                                                            <Form>
                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>Organisation name</Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        The name of the legal entity that signs the contract to access the
                                                                        data
                                                                    </p>
                                                                    <Form.Control
                                                                        readOnly={disableInput}
                                                                        id='organisationName'
                                                                        name='organisationName'
                                                                        type='text'
                                                                        className={
                                                                            formik.touched.organisationName &&
                                                                            formik.errors.organisationName
                                                                                ? 'emptyFormInput addFormInput'
                                                                                : 'addFormInput'
                                                                        }
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.organisationName}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                    {formik.touched.organisationName && formik.errors.organisationName ? (
                                                                        <div className='errorMessages'>
                                                                            {formik.errors.organisationName}
                                                                        </div>
                                                                    ) : null}
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>Organisation ID (optional)</Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        A unique identifier for an organisation that is preferably an
                                                                        industry used standard such as{' '}
                                                                        <a href='https://www.grid.ac/institutes' target='_blank'>
                                                                            Grid.ac
                                                                        </a>
                                                                    </p>
                                                                    <Form.Control
                                                                        readOnly={disableInput}
                                                                        id='organisationId'
                                                                        name='organisationId'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.organisationId}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>
                                                                        Organisation sector (optional)
                                                                    </Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        The type of organisation that has signed a contract to access the
                                                                        data
                                                                    </p>

                                                                    <Form.Control
                                                                        as='select'
                                                                        disabled={disableInput}
                                                                        id='organisationSector'
                                                                        name='organisationSector'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.organisationSector}
                                                                        onBlur={formik.handleBlur}>
                                                                        {organisationSectorList.map(l => (
                                                                            <option
                                                                                selected={formik.values.organisationSector === l}
                                                                                value={l}
                                                                                key={l}
                                                                                eventKey={l}>
                                                                                {l}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>
                                                                        Applicant name(s) (optional)
                                                                    </Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        The name of the Principal Investigator, as well as any other
                                                                        individuals that have been authorised to use the data. If they are
                                                                        on the Gateway, please provide their profile URL
                                                                    </p>
                                                                    <Typeahead
                                                                        disabled={disableInput}
                                                                        id='applicants'
                                                                        labelKey={applicant => `${applicant.name}`}
                                                                        allowNew
                                                                        multiple
                                                                        defaultSelected={formik.values.applicants}
                                                                        options={applicantsList}
                                                                        className='addFormInputTypeAhead'
                                                                        onChange={selected => {
                                                                            const tempSelected = [];
                                                                            selected.forEach(selectedItem => {
                                                                                selectedItem.customOption === true
                                                                                    ? tempSelected.push({
                                                                                          id: isNumber(selectedItem.id)
                                                                                              ? selectedItem.id
                                                                                              : 'nonGateway',
                                                                                          name: selectedItem.name || selectedItem.label,
                                                                                      })
                                                                                    : tempSelected.push(selectedItem);
                                                                            });
                                                                            formik.values.applicants = tempSelected;
                                                                        }}
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>Applicant ID (optional)</Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        ORCID identifier. This provides a persistent digital identifier that
                                                                        you own and control, and that distinguishes you from every other
                                                                        researcher. An ORCID profile can be created at https://orcid.org/
                                                                    </p>
                                                                    <Form.Control
                                                                        readOnly={disableInput}
                                                                        id='applicantId'
                                                                        name='applicantId'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.applicantId}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>Funders/Sponsor (optional)</Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        The name of any funders or sponsors involved in the project
                                                                    </p>
                                                                    <Form.Control
                                                                        readOnly={disableInput}
                                                                        id='fundersAndSponsors'
                                                                        name='fundersAndSponsors'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.fundersAndSponsors}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>
                                                                        DEA accredited researcher? (optional)
                                                                    </Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        Depending on the type of data you are requesting, you might be
                                                                        required to become an accredited researcher. Most access to data in
                                                                        the Secure Research Service (SRS) will be by researchers accredited
                                                                        under the Digital Economy Act 2017 (DEA). This specifies the
                                                                        accreditation status of the principal applicant/researcher, as
                                                                        defined by the ONS Research Code of Practice and Accreditation
                                                                        criteria
                                                                    </p>
                                                                    <Form.Control
                                                                        as='select'
                                                                        disabled={disableInput}
                                                                        id='accreditedResearcherStatus'
                                                                        name='accreditedResearcherStatus'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.accreditedResearcherStatus}
                                                                        onBlur={formik.handleBlur}>
                                                                        {yesNoList.map(l => (
                                                                            <option
                                                                                selected={formik.values.accreditedResearcherStatus === l}
                                                                                value={l}
                                                                                key={l}
                                                                                eventKey={l}>
                                                                                {l}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>
                                                                        Sub-licence arrangements (if any)? (optional)
                                                                    </Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        Identifies whether there are any permissions for the applicant to
                                                                        share the data beyond the named parties. e.g., NHS Digital may
                                                                        approve a data release to the ONS, who then makes decisions about
                                                                        access to accredited researchers undertaking approved projects in
                                                                        their own trusted research environment.
                                                                    </p>
                                                                    <Form.Control
                                                                        as='select'
                                                                        disabled={disableInput}
                                                                        id='sublicenceArrangements'
                                                                        name='sublicenceArrangements'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.sublicenceArrangements}
                                                                        onBlur={formik.handleBlur}>
                                                                        {yesNoList.map(l => (
                                                                            <option
                                                                                selected={formik.values.sublicenceArrangements === l}
                                                                                value={l}
                                                                                key={l}
                                                                                eventKey={l}>
                                                                                {l}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </Form.Group>
                                                            </Form>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                                <Card className='edit-datause-card'>
                                                    <Accordion.Toggle as={Button} variant='link' eventKey='1'>
                                                        <Card.Header
                                                            className='datause-accordion saved-search-arrow'
                                                            onClick={() => (!safeProject ? setSafeProject(true) : setSafeProject(false))}>
                                                            <SVGIcon
                                                                width='20px'
                                                                height='20px'
                                                                name='chevronbottom'
                                                                fill='#fff'
                                                                className={
                                                                    safeProject ? 'edit-datause-arrow' : 'flip180 edit-datause-arrow'
                                                                }
                                                            />
                                                            Safe project
                                                        </Card.Header>
                                                    </Accordion.Toggle>
                                                    <Accordion.Collapse className='datause-accordion-collapse' eventKey='1'>
                                                        <Card.Body className='datause-card-body'>
                                                            <Form>
                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>Project ID</Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        A unique identifier for the project that is preferably an industry
                                                                        used standard, such as IRAS ID. However for non-research projects, a
                                                                        unique reference number created by the data custodian on receipt of
                                                                        the application is sufficient
                                                                    </p>
                                                                    <Form.Control
                                                                        readOnly={props.data.manualUpload ? disableInput : true}
                                                                        id='projectIdText'
                                                                        name='projectIdText'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.projectIdText}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>Project title</Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        The title of the project/research study/request that the applicant
                                                                        is investigating through the use of health data
                                                                    </p>
                                                                    <Form.Control
                                                                        readOnly={disableInput}
                                                                        id='projectTitle'
                                                                        name='projectTitle'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.projectTitle}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <div style={{ display: 'inline-block' }}>
                                                                        <Form.Label className='black-14'>Lay summary (optional)</Form.Label>
                                                                        <p className='gray800-13-opacity datause-edit-p'>
                                                                            A concise and clear description of the project, (e.g. as
                                                                            required by URKI in funding applications). It should outline the
                                                                            problem, objectives and expected outcomes in language that is
                                                                            understandable to the general public
                                                                        </p>
                                                                    </div>
                                                                    <div style={{ display: 'inline-block', float: 'right' }}>
                                                                        <span className='gray700-13'>
                                                                            (
                                                                            <span id='currentLaySummaryCount'>
                                                                                {laySummaryCounter || 0}
                                                                            </span>
                                                                            /300)
                                                                        </span>
                                                                    </div>
                                                                    <Form.Control
                                                                        readOnly={disableInput}
                                                                        data-test-id='laySummary'
                                                                        as='textarea'
                                                                        id='laySummary'
                                                                        name='laySummary'
                                                                        type='text'
                                                                        className={
                                                                            formik.touched.laySummary && formik.errors.laySummary
                                                                                ? 'emptyFormInput addFormInput descriptionInput'
                                                                                : 'addFormInput descriptionInput'
                                                                        }
                                                                        onKeyUp={laySummaryCount}
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.laySummary}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                    {formik.touched.laySummary && formik.errors.laySummary ? (
                                                                        <div className='errorMessages'>{formik.errors.laySummary}</div>
                                                                    ) : null}
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <div style={{ display: 'inline-block' }}>
                                                                        <Form.Label className='black-14'>
                                                                            Public benefit statement (optional)
                                                                        </Form.Label>
                                                                        <p className='gray800-13-opacity datause-edit-p'>
                                                                            A description in plain English of the anticipated outcomes, or
                                                                            impact of project on the general public
                                                                        </p>
                                                                    </div>
                                                                    <Form.Control
                                                                        readOnly={disableInput}
                                                                        data-test-id='publicBenefitStatement'
                                                                        as='textarea'
                                                                        id='publicBenefitStatement'
                                                                        name='publicBenefitStatement'
                                                                        type='text'
                                                                        className={
                                                                            formik.touched.publicBenefitStatement &&
                                                                            formik.errors.publicBenefitStatement
                                                                                ? 'emptyFormInput addFormInput descriptionInput'
                                                                                : 'addFormInput descriptionInput'
                                                                        }
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.publicBenefitStatement}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                    {formik.touched.laySummary && formik.errors.publicBenefitStatement ? (
                                                                        <div className='errorMessages'>
                                                                            {formik.errors.publicBenefitStatement}
                                                                        </div>
                                                                    ) : null}
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>
                                                                        Request category type (optional)
                                                                    </Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        This categorises the 'purpose of the share' (i.e., research, policy
                                                                        development, etc)
                                                                    </p>
                                                                    <Form.Control
                                                                        as='select'
                                                                        disabled={disableInput}
                                                                        id='requestCategoryType'
                                                                        name='requestCategoryType'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.requestCategoryType}
                                                                        onBlur={formik.handleBlur}>
                                                                        {requestCategoryTypeList.map(l => (
                                                                            <option
                                                                                selected={formik.values.requestCategoryType === l}
                                                                                value={l}
                                                                                key={l}
                                                                                eventKey={l}>
                                                                                {l}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <div style={{ display: 'inline-block' }}>
                                                                        <Form.Label className='black-14'>
                                                                            Technical summary (optional)
                                                                        </Form.Label>
                                                                        <p className='gray800-13-opacity datause-edit-p'>
                                                                            A summary of the proposed research, in a manner that is suitable
                                                                            for a specialist reader
                                                                        </p>
                                                                    </div>
                                                                    <Form.Control
                                                                        readOnly={disableInput}
                                                                        data-test-id='technicalSummary'
                                                                        as='textarea'
                                                                        id='technicalSummary'
                                                                        name='technicalSummary'
                                                                        type='text'
                                                                        className='addFormInput descriptionInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.technicalSummary}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>
                                                                        Other approval committees (optional)
                                                                    </Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        Reference to other decision-making bodies that the project has
                                                                        already been authorised by
                                                                    </p>
                                                                    <Form.Control
                                                                        readOnly={disableInput}
                                                                        id='otherApprovalCommittees'
                                                                        name='otherApprovalCommittees'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.otherApprovalCommittees}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                </Form.Group>

                                                                <Row>
                                                                    <Col>
                                                                        {' '}
                                                                        <Form.Group>
                                                                            <Form.Label className='black-14'>
                                                                                Project start date (optional)
                                                                            </Form.Label>
                                                                            <p className='gray800-13-opacity datause-edit-p'>
                                                                                The date the project is scheduled to start or actual start
                                                                                date
                                                                            </p>
                                                                            <span className='datause-datepicker'>
                                                                                <DatePicker
                                                                                    disabled={disableInput}
                                                                                    id='projectStartDate'
                                                                                    name='projectStartDate'
                                                                                    dateFormat='dd/MM/yyyy'
                                                                                    peekNextMonth
                                                                                    showMonthDropdown
                                                                                    showYearDropdown
                                                                                    dropdownMode='select'
                                                                                    selected={
                                                                                        formik.values.projectStartDate
                                                                                            ? new Date(formik.values.projectStartDate)
                                                                                            : ''
                                                                                    }
                                                                                    onChange={date => {
                                                                                        formik.values.projectStartDate = date;
                                                                                        formik.setFieldValue();
                                                                                    }}
                                                                                    onBlur={formik.handleBlur}
                                                                                />
                                                                                <Calendar className='datePickerCalendar datause-calendar-svg' />
                                                                            </span>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col>
                                                                        <Form.Group>
                                                                            <Form.Label className='black-14'>
                                                                                Project end date (optional)
                                                                            </Form.Label>
                                                                            <p className='gray800-13-opacity datause-edit-p'>
                                                                                The date the project is scheduled to end or actual end date
                                                                            </p>
                                                                            <span className='datause-datepicker'>
                                                                                <DatePicker
                                                                                    disabled={disableInput}
                                                                                    id='projectEndDate'
                                                                                    name='projectEndDate'
                                                                                    dateFormat='dd/MM/yyyy'
                                                                                    peekNextMonth
                                                                                    showMonthDropdown
                                                                                    showYearDropdown
                                                                                    dropdownMode='select'
                                                                                    selected={
                                                                                        formik.values.projectEndDate
                                                                                            ? new Date(formik.values.projectEndDate)
                                                                                            : ''
                                                                                    }
                                                                                    onChange={date => {
                                                                                        formik.values.projectEndDate = date;
                                                                                        formik.setFieldValue();
                                                                                    }}
                                                                                    onBlur={formik.handleBlur}
                                                                                />
                                                                                <Calendar className='datePickerCalendar datause-calendar-svg' />
                                                                            </span>
                                                                        </Form.Group>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label className='black-14'>
                                                                                Latest approval date (optional)
                                                                            </Form.Label>
                                                                            <p className='gray800-13-opacity datause-edit-p'>
                                                                                The last date the data access request for this project was
                                                                                approved by a data custodian
                                                                            </p>

                                                                            <span className='datause-datepicker'>
                                                                                <DatePicker
                                                                                    disabled={disableInput}
                                                                                    id='latestApprovalDate'
                                                                                    name='latestApprovalDate'
                                                                                    dateFormat='dd/MM/yyyy'
                                                                                    peekNextMonth
                                                                                    showMonthDropdown
                                                                                    showYearDropdown
                                                                                    dropdownMode='select'
                                                                                    selected={
                                                                                        formik.values.latestApprovalDate
                                                                                            ? new Date(formik.values.latestApprovalDate)
                                                                                            : ''
                                                                                    }
                                                                                    onChange={date => {
                                                                                        formik.values.latestApprovalDate = date;
                                                                                        formik.setFieldValue();
                                                                                    }}
                                                                                    onBlur={formik.handleBlur}
                                                                                />
                                                                                <Calendar className='datePickerCalendar datause-calendar-svg' />
                                                                                {formik.touched.latestApprovalDate &&
                                                                                formik.errors.latestApprovalDate ? (
                                                                                    <div className='errorMessages'>
                                                                                        {formik.errors.latestApprovalDate}
                                                                                    </div>
                                                                                ) : null}
                                                                            </span>
                                                                        </Form.Group>
                                                                    </Col>
                                                                </Row>
                                                            </Form>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                                <Card className='edit-datause-card'>
                                                    <Accordion.Toggle as={Button} variant='link' eventKey='2'>
                                                        <Card.Header
                                                            className='datause-accordion saved-search-arrow'
                                                            onClick={() => (!safeData ? setSafeData(true) : setSafeData(false))}>
                                                            <SVGIcon
                                                                width='20px'
                                                                height='20px'
                                                                name='chevronbottom'
                                                                fill='#fff'
                                                                className={safeData ? 'edit-datause-arrow' : 'flip180 edit-datause-arrow'}
                                                            />
                                                            Safe data
                                                        </Card.Header>
                                                    </Accordion.Toggle>
                                                    <Accordion.Collapse className='datause-accordion-collapse' eventKey='2'>
                                                        <Card.Body className='datause-card-body'>
                                                            <Form>
                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>Dataset(s) name</Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        The name of the dataset(s) being accessed
                                                                    </p>
                                                                    <Typeahead
                                                                        disabled={props.data.manualUpload ? disableInput : true}
                                                                        id='datasets'
                                                                        labelKey={dataset => `${dataset.name}`}
                                                                        allowNew
                                                                        multiple
                                                                        defaultSelected={formik.values.datasets}
                                                                        options={datasetsList}
                                                                        className='addFormInputTypeAhead'
                                                                        onChange={selected => {
                                                                            const tempSelected = [];
                                                                            selected.forEach(selectedItem => {
                                                                                selectedItem.customOption === true
                                                                                    ? tempSelected.push({
                                                                                          id: isNumber(selectedItem.pid)
                                                                                              ? selectedItem.pid
                                                                                              : 'nonGateway',
                                                                                          name: selectedItem.name || selectedItem.label,
                                                                                      })
                                                                                    : tempSelected.push(selectedItem);
                                                                            });
                                                                            formik.values.datasets = tempSelected;
                                                                        }}
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>
                                                                        Data sensitivity level (optional)
                                                                    </Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        The level of identifiability of the data being accessed, as defined
                                                                        by Understanding Patient Data{' '}
                                                                    </p>
                                                                    <Form.Control
                                                                        as='select'
                                                                        disabled={disableInput}
                                                                        id='dataSensitivityLevel'
                                                                        name='dataSensitivityLevel'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.dataSensitivityLevel}
                                                                        onBlur={formik.handleBlur}>
                                                                        {dataSensitivityLevelList.map(l => (
                                                                            <option
                                                                                selected={formik.values.dataSensitivityLevel === l}
                                                                                value={l}
                                                                                key={l}
                                                                                eventKey={l}>
                                                                                {l}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>
                                                                        Legal basis for provision of data under Article 6 (optional)
                                                                    </Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        The lawful basis for processing are set out in Article 6 of the
                                                                        GDPR. At least one legal basis must apply whenever you process
                                                                        personal data. Please select appropriate Article 6 lawful basis.
                                                                        Processing shall be lawful only if and to the extent that at least
                                                                        one of the following applies
                                                                    </p>

                                                                    <Form.Control
                                                                        as='select'
                                                                        disabled={disableInput}
                                                                        id='legalBasisForDataArticle6'
                                                                        name='legalBasisForDataArticle6'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.legalBasisForDataArticle6}
                                                                        onBlur={formik.handleBlur}>
                                                                        {legalBasisForDataArticle6List.map(l => (
                                                                            <option
                                                                                selected={formik.values.legalBasisForDataArticle6 === l}
                                                                                value={l}
                                                                                key={l}
                                                                                eventKey={l}>
                                                                                {l}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>
                                                                        Lawful conditions for provision of data under Article 9 (optional)
                                                                    </Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        Processing of personal data revealing racial or ethnic origin,
                                                                        political opinions, religious or philosophical beliefs, or trade
                                                                        union membership, and the processing of genetic data, biometric data
                                                                        for the purpose of uniquely identifying a natural person, data
                                                                        concerning health or data concerning a natural person's sex life or
                                                                        sexual orientation shall be prohibited. This does not apply if one
                                                                        of the following applies
                                                                    </p>
                                                                    <Form.Control
                                                                        as='select'
                                                                        disabled={disableInput}
                                                                        id='legalBasisForDataArticle9'
                                                                        name='legalBasisForDataArticle9'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.legalBasisForDataArticle9}
                                                                        onBlur={formik.handleBlur}>
                                                                        {legalBasisForDataArticle9List.map(l => (
                                                                            <option
                                                                                selected={formik.values.legalBasisForDataArticle9 === l}
                                                                                value={l}
                                                                                key={l}
                                                                                eventKey={l}>
                                                                                {l}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>
                                                                        Common law of duty of confidentiality (optional)
                                                                    </Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        If confidential information is being disclosed , the organisations
                                                                        holding this data (both the organisation disclosing the information
                                                                        and the recipient organisation) must also have a lawful basis to
                                                                        hold and use this information, and if applicable, have a condition
                                                                        to hold and use special categories of confidential information, and
                                                                        be fair and transparent about how they hold and use this data. In
                                                                        England and Wales, if you are using section 251 of the NHS Act 2006
                                                                        (s251) as a legal basis for identifiable data, you will need to
                                                                        ensure that you have the latest approval letter and application. For
                                                                        Scotland this application will be reviewed by the Public Benefit and
                                                                        Privacy Panel. In Northern Ireland it will be considered by the
                                                                        Privacy Advisory Committee. If you are using patient consent as the
                                                                        legal basis, you will need to provide all relevant consent forms and
                                                                        information leaflets.
                                                                    </p>
                                                                    <Form.Control
                                                                        as='select'
                                                                        disabled={disableInput}
                                                                        id='dutyOfConfidentiality'
                                                                        name='dutyOfConfidentiality'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.dutyOfConfidentiality}
                                                                        onBlur={formik.handleBlur}>
                                                                        {dutyOfConfidentialityList.map(l => (
                                                                            <option
                                                                                selected={formik.values.dutyOfConfidentiality === l}
                                                                                value={l}
                                                                                key={l}
                                                                                eventKey={l}>
                                                                                {l}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>
                                                                        National data opt-out applied? (optional)
                                                                    </Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        Specifies whether the preference for people to opt-out of their
                                                                        confidential patient information being used for secondary use has
                                                                        been applied to the data prior to release
                                                                    </p>
                                                                    <Form.Control
                                                                        as='select'
                                                                        disabled={disableInput}
                                                                        id='nationalDataOptOut'
                                                                        name='nationalDataOptOut'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.nationalDataOptOut}
                                                                        onBlur={formik.handleBlur}>
                                                                        {yesNoNotList.map(l => (
                                                                            <option
                                                                                selected={formik.values.nationalDataOptOut === l}
                                                                                value={l}
                                                                                key={l}
                                                                                eventKey={l}>
                                                                                {l}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>
                                                                        Request frequency (optional)
                                                                    </Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        Determines whether this a 'one-off' request or a recurring dataset
                                                                        to be provided over a specific time period
                                                                    </p>
                                                                    <Form.Control
                                                                        as='select'
                                                                        disabled={disableInput}
                                                                        id='requestFrequency'
                                                                        name='requestFrequency'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.requestFrequency}
                                                                        onBlur={formik.handleBlur}>
                                                                        {requestFrequencyList.map(l => (
                                                                            <option
                                                                                selected={formik.values.requestFrequency === l}
                                                                                value={l}
                                                                                key={l}
                                                                                eventKey={l}>
                                                                                {l}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>
                                                                        For linked datasets, specify how the linkage will take place
                                                                        (optional)
                                                                    </Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        Specifies whether applicant intends for the datasets to be linked
                                                                        with any additional datasets. Relevant information on the
                                                                        organisations undertaking linkages and how the linkage will take
                                                                        place must also be disclosed. As well as, a summary of the
                                                                        risks/mitigations to be considered
                                                                    </p>
                                                                    <Form.Control
                                                                        readOnly={disableInput}
                                                                        data-test-id='datasetLinkageDescription'
                                                                        as='textarea'
                                                                        id='datasetLinkageDescription'
                                                                        name='datasetLinkageDescription'
                                                                        type='text'
                                                                        className='addFormInput descriptionInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.datasetLinkageDescription}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>
                                                                        Description of how the data will be used (optional)
                                                                    </Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        A description of the specific patient identifiable fields that have
                                                                        been included in the dataset(s) being accessed
                                                                    </p>
                                                                    <Form.Control
                                                                        readOnly={disableInput}
                                                                        data-test-id='confidentialDataDescription'
                                                                        as='textarea'
                                                                        id='confidentialDataDescription'
                                                                        name='confidentialDataDescription'
                                                                        type='text'
                                                                        className='addFormInput descriptionInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.confidentialDataDescription}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>
                                                                        Release/Access date (optional)
                                                                    </Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        The date the data access was granted and active research started
                                                                    </p>
                                                                    {/* <Form.Control type='text' placeholder='' defaultValue={props.data.accessDate} /> */}
                                                                    <Row md={6}>
                                                                        {' '}
                                                                        <span className='datause-datepicker datapicker-releaseaccess'>
                                                                            <DatePicker
                                                                                disabled={disableInput}
                                                                                id='accessDate'
                                                                                name='accessDate'
                                                                                dateFormat='dd/MM/yyyy'
                                                                                peekNextMonth
                                                                                showMonthDropdown
                                                                                showYearDropdown
                                                                                dropdownMode='select'
                                                                                selected={
                                                                                    formik.values.accessDate
                                                                                        ? new Date(formik.values.accessDate)
                                                                                        : ''
                                                                                }
                                                                                onChange={date => {
                                                                                    formik.values.accessDate = date;
                                                                                    formik.setFieldValue();
                                                                                }}
                                                                                onBlur={formik.handleBlur}
                                                                            />
                                                                            <Calendar className='datePickerCalendar datause-calendar-svg' />
                                                                        </span>
                                                                    </Row>
                                                                </Form.Group>
                                                            </Form>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>

                                                <Card className='edit-datause-card'>
                                                    <Accordion.Toggle as={Button} variant='link' eventKey='3'>
                                                        <Card.Header
                                                            className='datause-accordion saved-search-arrow'
                                                            onClick={() =>
                                                                !safeSettings ? setSafeSettings(true) : setSafeSettings(false)
                                                            }>
                                                            <SVGIcon
                                                                width='20px'
                                                                height='20px'
                                                                name='chevronbottom'
                                                                fill='#fff'
                                                                className={
                                                                    safeSettings ? 'edit-datause-arrow' : 'flip180 edit-datause-arrow'
                                                                }
                                                            />
                                                            Safe settings
                                                        </Card.Header>
                                                    </Accordion.Toggle>
                                                    <Accordion.Collapse className='datause-accordion-collapse' eventKey='3'>
                                                        <Card.Body className='datause-card-body'>
                                                            <Form>
                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>Access type (optional)</Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        Determines whether the data will be accessed within a Trusted
                                                                        Research Environment (TRE) or via the traditional data release
                                                                        modelDetermines whether the data will be accessed within a Trusted
                                                                        Research Environment (TRE) or via the traditional data release model
                                                                    </p>
                                                                    <Form.Control
                                                                        as='select'
                                                                        disabled={disableInput}
                                                                        id='accessType'
                                                                        name='accessType'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.accessType}
                                                                        onBlur={formik.handleBlur}>
                                                                        {accessTypeList.map(l => (
                                                                            <option
                                                                                selected={formik.values.accessType === l}
                                                                                value={l}
                                                                                key={l}
                                                                                eventKey={l}>
                                                                                {l}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Control>
                                                                    {formik.touched.accessType && formik.errors.accessType ? (
                                                                        <div
                                                                            className='errorMessages margin-top-8'
                                                                            data-test-id='user-account-sector-validation'>
                                                                            {formik.errors.accessType}
                                                                        </div>
                                                                    ) : null}
                                                                </Form.Group>

                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>
                                                                        How has data been processed to enhance privacy? (optional)
                                                                    </Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        Description of the tools or software used to reduce level of
                                                                        identifiable data being shared
                                                                    </p>
                                                                    <Form.Control
                                                                        readOnly={disableInput}
                                                                        id='privacyEnhancements'
                                                                        name='privacyEnhancements'
                                                                        type='text'
                                                                        className='addFormInput'
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.privacyEnhancements}
                                                                        onBlur={formik.handleBlur}
                                                                    />
                                                                </Form.Group>
                                                            </Form>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>

                                                <Card className='edit-datause-card'>
                                                    <Accordion.Toggle as={Button} variant='link' eventKey='4'>
                                                        <Card.Header
                                                            className='datause-accordion saved-search-arrow'
                                                            onClick={() => (!safeOutput ? setSafeOutput(true) : setSafeOutput(false))}>
                                                            <SVGIcon
                                                                width='20px'
                                                                height='20px'
                                                                name='chevronbottom'
                                                                fill='#fff'
                                                                className={safeOutput ? 'edit-datause-arrow' : 'flip180 edit-datause-arrow'}
                                                            />
                                                            Safe output
                                                        </Card.Header>
                                                    </Accordion.Toggle>
                                                    <Accordion.Collapse className='datause-accordion-collapse' eventKey='4'>
                                                        <Card.Body className='datause-card-body'>
                                                            <Form>
                                                                <Row className='mt-2'>
                                                                    <Col sm={12} lg={8}>
                                                                        <p className='gray800-14 margin-bottom-0 pad-bottom-4'>
                                                                            Link to research outputs (optional)
                                                                        </p>
                                                                        <p className='gray700-13 margin-bottom-0'>
                                                                            A URL link to any academic or non-academic research outputs, as
                                                                            they become available, including code used. If the link is to a
                                                                            Gateway resource, this will automatically populate in related
                                                                            resources.
                                                                        </p>
                                                                    </Col>
                                                                </Row>

                                                                <Row className='mt-2'>
                                                                    <FieldArray
                                                                        name='document_links'
                                                                        render={({ remove, push }) => (
                                                                            <>
                                                                                {safeOuputsArray.length > 0 &&
                                                                                    safeOuputsArray.map((d, index) => (
                                                                                        <>
                                                                                            <Col sm={12} lg={10}>
                                                                                                <Form.Group labelKey='safeOuputsArray'>
                                                                                                    <Typeahead
                                                                                                        id={`safeOuputsArray_${index}`}
                                                                                                        className='addFormInput'
                                                                                                        allowNew
                                                                                                        options={safeOuputsList}
                                                                                                        onChange={selected => {
                                                                                                            if (!isEmpty(selected)) {
                                                                                                                if (
                                                                                                                    selected[0]
                                                                                                                        .customOption ===
                                                                                                                    true
                                                                                                                ) {
                                                                                                                    formik.values.safeOutput[
                                                                                                                        index
                                                                                                                    ] = {
                                                                                                                        id: isNumber(
                                                                                                                            selected[0].id
                                                                                                                        )
                                                                                                                            ? selected[0].id
                                                                                                                            : 'nonGateway',
                                                                                                                        name:
                                                                                                                            selected[0]
                                                                                                                                .name ||
                                                                                                                            selected[0]
                                                                                                                                .label,
                                                                                                                    };
                                                                                                                } else {
                                                                                                                    formik.values.safeOutput[
                                                                                                                        index
                                                                                                                    ] = selected[0];
                                                                                                                }
                                                                                                            }
                                                                                                        }}
                                                                                                        selected={[
                                                                                                            formik.values.safeOutput[index],
                                                                                                        ]}
                                                                                                        labelKey={output =>
                                                                                                            `${output.name}`
                                                                                                        }
                                                                                                    />
                                                                                                </Form.Group>
                                                                                            </Col>

                                                                                            <Col
                                                                                                style={{ paddingRight: '0px' }}
                                                                                                className='col-sm-6 col-md-2 d-flex justify-content-center align-items-center setHeight'>
                                                                                                <button
                                                                                                    type='button'
                                                                                                    className='plusMinusButton'
                                                                                                    disabled={safeOuputsArray.length < 2}
                                                                                                    onClick={() => {
                                                                                                        remove(index);
                                                                                                        safeOuputsArray.splice(index, 1);
                                                                                                    }}>
                                                                                                    -
                                                                                                </button>
                                                                                                <button
                                                                                                    data-test-id={`add-link-${index}`}
                                                                                                    type='button'
                                                                                                    disabled={
                                                                                                        safeOuputsArray.length - 1 !== index
                                                                                                    }
                                                                                                    className='plusMinusButton'
                                                                                                    onClick={() => {
                                                                                                        push('');
                                                                                                        safeOuputsArray.push({
                                                                                                            id: '',
                                                                                                            name: '',
                                                                                                        });
                                                                                                    }}>
                                                                                                    +
                                                                                                </button>
                                                                                            </Col>
                                                                                        </>
                                                                                    ))}
                                                                            </>
                                                                        )}
                                                                    />
                                                                </Row>
                                                            </Form>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>

                                                <Card className='edit-datause-card'>
                                                    <Accordion.Toggle as={Button} variant='link' eventKey='5'>
                                                        <Card.Header
                                                            className='datause-accordion saved-search-arrow'
                                                            onClick={() => (!keywords ? setKeywords(true) : setKeywords(false))}>
                                                            <SVGIcon
                                                                width='20px'
                                                                height='20px'
                                                                name='chevronbottom'
                                                                fill='#fff'
                                                                className={keywords ? 'edit-datause-arrow' : 'flip180 edit-datause-arrow'}
                                                            />
                                                            Keywords
                                                        </Card.Header>
                                                    </Accordion.Toggle>
                                                    <Accordion.Collapse className='datause-accordion-collapse' eventKey='5'>
                                                        <Card.Body className='datause-card-body'>
                                                            <Form>
                                                                <Form.Group>
                                                                    <Form.Label className='black-14'>Keywords (optional)</Form.Label>
                                                                    <p className='gray800-13-opacity datause-edit-p'>
                                                                        Select maximum 5 keywords that will help make your data use easily
                                                                        searchable
                                                                    </p>
                                                                    <Typeahead
                                                                        id='keywords'
                                                                        labelKey='keywords'
                                                                        allowNew
                                                                        defaultSelected={formik.values.keywords}
                                                                        multiple
                                                                        options={props.keywordsData}
                                                                        className='addFormInputTypeAhead'
                                                                        onChange={selected => {
                                                                            const tempSelected = [];
                                                                            selected.forEach(selectedItem => {
                                                                                selectedItem.customOption === true
                                                                                    ? tempSelected.push(selectedItem.keywords)
                                                                                    : tempSelected.push(selectedItem);
                                                                            });
                                                                            formik.values.keywords = tempSelected;
                                                                        }}
                                                                    />
                                                                </Form.Group>
                                                            </Form>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>

                                                <Card className='edit-datause-card'>
                                                    <Accordion.Toggle as={Button} variant='link' eventKey='6'>
                                                        <Card.Header
                                                            className='datause-accordion saved-search-arrow'
                                                            onClick={() =>
                                                                !relatedResources ? setRelatedResources(true) : setRelatedResources(false)
                                                            }>
                                                            <SVGIcon
                                                                width='20px'
                                                                height='20px'
                                                                name='chevronbottom'
                                                                fill='#fff'
                                                                className={
                                                                    relatedResources ? 'edit-datause-arrow' : 'flip180 edit-datause-arrow'
                                                                }
                                                            />
                                                            Related resources
                                                        </Card.Header>
                                                    </Accordion.Toggle>
                                                    <Accordion.Collapse className='datause-accordion-collapse' eventKey='6'>
                                                        <Card.Body className='datause-card-body'>
                                                            <div className='datause-related-resources'>
                                                                <p className='black-20-semibold'>Related resources </p>
                                                                <p className='black-14'>(optional)</p>
                                                            </div>

                                                            <p className='gray800-13-opacity'>
                                                                Link this to other papers, data uses, datasets, tools, courses and people.
                                                                Resources must be added to the Gateway first.
                                                            </p>
                                                            <hr className='datause-border' />
                                                            {props.relatedObjects.length === 0 ? (
                                                                ''
                                                            ) : (
                                                                <div className='rectangle'>
                                                                    {props.relatedObjects.map(object =>
                                                                        !isNil(object.objectId) ? (
                                                                            <RelatedObject
                                                                                showRelationshipQuestion
                                                                                objectId={object.objectId}
                                                                                pid={object.pid}
                                                                                objectType={object.objectType}
                                                                                doRemoveObject={props.doRemoveObject}
                                                                                doUpdateReason={updateReason}
                                                                                reason={object.reason}
                                                                                didDelete={props.didDelete}
                                                                                updateDeleteFlag={props.updateDeleteFlag}
                                                                                isLocked={object.isLocked}
                                                                            />
                                                                        ) : (
                                                                            ''
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                            {disableInput ? (
                                                                ''
                                                            ) : (
                                                                <div className='rectangle flexCenter pixelGapTop'>
                                                                    <Row>
                                                                        <Col sm={1} lg={1} />
                                                                        <Col sm={10} lg={10}>
                                                                            <RelatedResources
                                                                                ref={relatedResourcesRef}
                                                                                searchString={props.searchString}
                                                                                doSearchMethod={props.doSearchMethod}
                                                                                doUpdateSearchString={props.doUpdateSearchString}
                                                                                userState={props.userState}
                                                                                datasetData={props.datasetData}
                                                                                toolData={props.toolData}
                                                                                datauseData={props.datauseData}
                                                                                paperData={props.paperData}
                                                                                personData={props.personData}
                                                                                courseData={props.courseData}
                                                                                summary={props.summary}
                                                                                doAddToTempRelatedObjects={props.doAddToTempRelatedObjects}
                                                                                tempRelatedObjectIds={props.tempRelatedObjectIds}
                                                                                relatedObjects={props.relatedObjects}
                                                                                doClearRelatedObjects={props.doClearRelatedObjects}
                                                                                doAddToRelatedObjects={props.doAddToRelatedObjects}
                                                                            />
                                                                        </Col>
                                                                        <Col sm={1} lg={10} />
                                                                    </Row>
                                                                </div>
                                                            )}
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                            </Accordion>
                                        </div>
                                    </Col>
                                    <Col sm={1} lg={10} />
                                </Row>
                                <Row>
                                    <span className='formBottomGap' />
                                </Row>
                            </div>
                        );
                    }}
                />
            </div>
            <ActionBar userState={props.userState}>
                <div className='floatRight'>
                    <a style={{ cursor: 'pointer' }} href='/account?tab=datause'>
                        <Button variant='medium' className='cancelButton dark-14 mr-2'>
                            Cancel
                        </Button>
                    </a>
                    <Button
                        data-test-id='add-datause-publish'
                        variant='primary'
                        className='publishButton white-14-semibold mr-2'
                        type='submit'
                        onClick={formik.handleSubmit}>
                        Save
                    </Button>
                </div>
            </ActionBar>
        </div>
    );
};

export default EditFormDataUse;
