import { rest } from 'msw';
import { apiURL } from '../../configs/url.config';

export const mockContributorsInfo = [
    {
        _id: '5e6f984a0a7300dc8f6fb196',
        id: 2623650828181272,
        firstname: 'Ciara',
        lastname: 'Ward',
        orcid: 'https://orcid.org/https://www.ons.gov.uk/peoplepopulationandcommunity/healthandsocialcare/conditionsanddiseases/articles/impactofcoronavirusincarehomesinenglandvivaldi/26mayto19june2020',
        organisation: 'test',
        showOrganisation: true,
        showOrcid: true,
        user: {
            email: 'ciara.ward@paconsulting.com',
        },
    },
    {
        _id: '5eb2f98d60ac5289acdd2512',
        id: 5385077600698822,
        firstname: 'Paul',
        lastname: 'McCafferty',
        orcid: '',
        organisation: 'PA Consulting',
        showOrcid: true,
        showOrganisation: true,
        bio: '',
        sector: '',
        domain: '',
        link: '',
    },
    {
        _id: '5eddf1593ca18f0915d15648',
        id: 46035149615760184,
        firstname: 'Ciara',
        lastname: 'Test',
        orcid: 'https://orcid.org/test',
        organisation: '',
        showOrcid: true,
        showOrganisation: false,
        bio: '',
        sector: '',
        domain: '',
        link: '',
    },
];

export const mswGetContributors = rest.get(`${apiURL}/data-access-request/prepopulate-contributors/123`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            data: mockContributorsInfo,
        })
    );
});

export default [mswGetContributors];
