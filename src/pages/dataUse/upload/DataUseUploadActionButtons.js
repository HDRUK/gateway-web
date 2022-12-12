import { Button } from 'hdruk-react-core';
import { useCallback } from 'react';
import googleAnalytics from '../../../tracking';

const DataUseUploadActionButtons = ({ onSubmit }) => {
    const handleAnalytics = (label, value) => {
        googleAnalytics.recordEvent('Data uses', label, value);
    };

    const handleSubmitDataUses = useCallback(() => {
        handleAnalytics('Clicked submit data uses');

        onSubmit();
    }, []);

    return (
        <Button variant='secondary' onClick={handleSubmitDataUses}>
            Submit data uses
        </Button>
    );
};

export default DataUseUploadActionButtons;
