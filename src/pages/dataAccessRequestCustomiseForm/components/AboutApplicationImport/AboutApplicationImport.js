import { useCallback, useState } from 'react';
import { H5, P, Button } from 'hdruk-react-core';

import { FileSelector } from 'components';

const AboutApplicationImport = ({ onUpload }) => {
    const [fileText, setFileText] = useState('');

    const handleUpload = useCallback(
        helpers => {
            if (fileText) onUpload(JSON.parse(fileText), helpers);
        },
        [fileText]
    );

    return (
        <>
            <H5>Import Data Access Request configuration file</H5>
            <P color='grey800' mb={4}>
                You can now import your Data Access Request (DAR) configuration file to populate the DAR from one environment to another
                without loss of data integrity.
            </P>
            <FileSelector
                actions={({ fileList, readAsText, reset }) => {
                    if (fileList.length) {
                        readAsText(fileList[0]).then(text => {
                            setFileText(text);
                        });
                    }

                    return fileList.length ? <Button onClick={() => handleUpload({ reset })}>Upload</Button> : null;
                }}
                noFilesMessage='No files have been uploaded yet'
            />
        </>
    );
};

export default AboutApplicationImport;
