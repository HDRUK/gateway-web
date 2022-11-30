import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { H6 } from 'hdruk-react-core';

import { Icon } from 'components';
import { ReactComponent as LockedIcon } from '../../../../images/icons/locked.svg';

const AboutApplication = ({ sections }) => {
    return (
        <div className='aboutAccordion'>
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
