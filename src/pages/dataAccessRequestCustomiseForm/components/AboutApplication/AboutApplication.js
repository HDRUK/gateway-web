import React, { useCallback, useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import Icon from '../../../../components/Icon';
import FileSelector from '../../../../components/FileSelector';
import { H5, H6, P } from '../../../../components/Typography';
import { ReactComponent as LockedIcon } from '../../../../images/icons/locked.svg';
import LayoutBox from '../../../../components/LayoutBox';
import Button from '../../../../components/Button';
import { isPublisherAdmin } from '../../../../utils/auth';

const AboutApplication = ({ userState, team, sections, onUpload }) => {
    const [fileText, setFileText] = useState('');

    const handleUpload = useCallback(
        helpers => {
            if (fileText) onUpload(JSON.parse(fileText), helpers);
        },
        [fileText]
    );

    return (
        <div className='aboutAccordion'>
            {isPublisherAdmin(userState, team) && (
                <Card>
                    <LayoutBox pl={5} pr={5} mb={6}>
                        <H5>Import Data Access Request configuration file</H5>
                        <P color='grey800'>
                            You can now import youre Data Access Request (DAR) configuration file to populate the DAR from one environment
                            to another without loss of data integrity.
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
                    </LayoutBox>
                </Card>
            )}
            <Accordion disabled>
                {sections.map((section, i) => (
                    <Card>
                        <Accordion.Toggle as={Card.Header}>
                            <H6 color='grey600' width='100%' mb={0}>
                                <span className='stepNumber'>{i + 1}</span>
                                {section}
                            </H6>
                            <Icon svg={<LockedIcon />} size='2xl' ml={2} />
                        </Accordion.Toggle>
                    </Card>
                ))}
            </Accordion>
        </div>
    );
};

export default AboutApplication;
