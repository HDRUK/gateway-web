import React, { useCallback, useState } from 'react';
import FileSelector from '../../../../components/FileSelector';
import { H5, P } from '../../../../components/Typography';
import LayoutBox from '../../../../components/LayoutBox';
import Button from '../../../../components/Button';
import { isPublisherAdmin } from '../../../../utils/auth';

const AboutApplicationImport = ({ userState, team, onUpload }) => {
    const [fileText, setFileText] = useState('');

    const handleUpload = useCallback(
        helpers => {
            if (fileText) onUpload(JSON.parse(fileText), helpers);
        },
        [fileText]
    );

    return isPublisherAdmin(userState, team) ? (
        <>
            <H5>Import Data Access Request configuration file</H5>
            <P color='grey800'>
                You can now import youre Data Access Request (DAR) configuration file to populate the DAR from one environment to another
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
                noFilesMessage='No files have been selected'
            />
        </>
    ) : null;
};

export default AboutApplicationImport;
