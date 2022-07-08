import googleAnalytics from '../../tracking';

const handleAnalytics = (label, value) => {
    googleAnalytics.recordEvent('Question Bank', label, value);
};

export default handleAnalytics;
