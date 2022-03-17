import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import About from './About';

const mockData = {
    success: true,
    _id: '61ea77b94e9d631a4d8f3b95',
    counter: 143,
    keywords: [],
    datasetTitles: ['COVID-19 Symptom Tracker Dataset'],
    gatewayDatasets: ['c1f4b16c-9dfa-48e5-94ee-f0aa58c270e4'],
    nonGatewayDatasets: [],
    gatewayApplicants: [
        {
            _id: '600bfc99c8bf700f2c7d5c36',
            firstname: 'NHS',
            lastname: 'Digital',
            id: 123,
        },
        {
            _id: '60252fcf6badf9788a1ae0e5',
            firstname: 'GCP',
            lastname: 'Service Account',
            id: 123,
        },
    ],
    nonGatewayApplicants: [],
    fundersAndSponsors: [],
    otherApprovalCommittees: [],
    gatewayOutputsTools: [],
    gatewayOutputsPapers: [],
    nonGatewayOutputs: [],
    projectTitle: 'test title',
    projectIdText: '123',
    organisationName: 'Testing1, Testing2',
    relatedObjects: [
        {
            _id: '61ea77b94e9d631a4d8f3b96',
            objectId: '78ce070c-84db-4676-81c5-0c672f4e12e3',
            pid: 'c1f4b16c-9dfa-48e5-94ee-f0aa58c270e4',
            objectType: 'dataset',
            user: 'Callum Reekie',
            updated: '21 Jan 2022',
            isLocked: true,
            reason: 'This dataset was added automatically during the manual upload of this data use register',
            datasetPublisher: 'SAIL',
            datasetLogo: '',
            name: 'COVID-19 Symptom Tracker Dataset',
            firstname: '',
            lastname: '',
            projectTitle: '',
        },
        {
            _id: '61ea795c4e9d631a4d8f3dd4',
            objectId: '50651e2d-5c39-4ab8-bdd5-08b388c209af',
            objectType: 'dataset',
            pid: 'fc1cb86f-0cb5-4b5d-be36-eb4aa892aa26',
            user: 'Callum Reekie',
            updated: '21 Jan 2022',
            reason: 'com',
            datasetPublisher: 'SAIL',
            datasetLogo: '',
            name: 'Activity Log Test - change the title4',
            firstname: '',
            lastname: '',
            projectTitle: '',
        },
        {
            _id: '61ea795c4e9d631a4d8f3dd5',
            objectId: '9381956449529044',
            objectType: 'paper',
            user: 'Callum Reekie',
            updated: '21 Jan 2022',
            reason: 'com',
            datasetPublisher: '',
            datasetLogo: '',
            name: 'test paper',
            firstname: '',
            lastname: '',
            projectTitle: '',
        },
        {
            _id: '61ea795c4e9d631a4d8f3dd6',
            objectId: '701594274314441',
            objectType: 'tool',
            user: 'Callum Reekie',
            updated: '21 Jan 2022',
            reason: 'com',
            datasetPublisher: '',
            datasetLogo: '',
            name: '787',
            firstname: '',
            lastname: '',
            projectTitle: '',
        },
    ],
    activeflag: 'active',
    publisher: '5f3f98068af2ef61552e1d75',
    user: '616993c3034a7d773064e208',
    updatedon: '2022-02-23T15:12:48.457Z',
    lastActivity: '2022-02-23T15:12:48.457Z',
    manualUpload: true,
    id: 3577664070096995,
    type: 'dataUseRegister',
    createdAt: '2022-01-21T09:07:05.981Z',
    updatedAt: '2022-02-23T15:12:48.458Z',
    rejectionReason: '',
    accessType: '',
    accreditedResearcherStatus: '',
    applicantId: '',
    confidentialDataDescription: '',
    dataSensitivityLevel: '',
    datasetLinkageDescription: '',
    dutyOfConfidentiality: '',
    laySummary: '',
    legalBasisForDataArticle6: '',
    legalBasisForDataArticle9: '',
    nationalDataOptOut: '',
    organisationId: '',
    organisationSector: '',
    privacyEnhancements: '',
    publicBenefitStatement: '',
    requestCategoryType: '',
    requestFrequency: '',
    sublicenceArrangements: '',
    technicalSummary: '',
    gatewayOutputsToolsInfo: [],
    gatewayOutputsPapersInfo: [],
    gatewayDatasetsInfo: [
        [
            {
                _id: '609156d9046499024bde306e',
                pid: '123',
                name: 'COVID-19 Symptom Tracker Dataset1',
            },
            {
                _id: '603eb952233ebb6161205d26',
                pid: '1234',
                name: 'COVID-19 Symptom Tracker Dataset2',
            },
        ],
    ],
};
let wrapper;

describe('Given the AboutSection component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<About data={mockData} />);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('OrganistionName should be displayed  in badges', () => {
            expect(screen.getByTestId(`badge-Testing1`)).toHaveTextContent(`Testing1`);
            expect(screen.getByTestId(`badge-Testing2`)).toHaveTextContent(`Testing2`);
        });

        it('empty vaue should have `Not specified` displayed', () => {
            expect(screen.getByTestId(`laySummary-details`)).toHaveTextContent(`Not specifie`);
        });
    });
});
