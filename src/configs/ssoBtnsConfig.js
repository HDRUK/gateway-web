import googleIcon from '../images/icons/google-logo.png';
import instIcon from '../images/icons/institution-icon.png';
import microsoftIcon from '../images/icons/microsoft-logo.png';
import linkedInIcon from '../images/icons/LI-In.png';
import orcidIcon from '../images/icons/ORCIDiD_icon.png';

export const ssoBtnsConfig = [
    { id: 'google', text: 'Sign in with Google', authURL: '/auth/google', img: googleIcon, active: false },
    { id: 'openAthens', text: 'Sign in with institution', authURL: '/auth/oidc', img: instIcon, active: false },
    { id: 'linkedin', text: 'Sign in with LinkedIn', authURL: '/auth/linkedin', img: linkedInIcon, active: false },
    { id: 'azure', text: 'Sign in with Microsoft', authURL: '/auth/azure', img: microsoftIcon, active: false },
    { id: 'orcid', text: 'Sign in with ORCiD', authURL: '/auth/orcid', img: orcidIcon, active: false },
];
