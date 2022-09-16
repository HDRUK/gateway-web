import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Collapsable, Icon } from 'hdruk-react-core';

import { t } from 'i18next';
import { Button } from 'react-bootstrap';
import { ReactComponent as ArrowDown } from '../../../images/icons/arrow-down.svg';
import { ReactComponent as ArrowUp } from '../../../images/icons/arrow-up.svg';
import './ShowMore.scss';

const ShowMore = ({ children, initialHeight }) => {
    const [showMore, setShowMore] = useState(false);
    const [shouldShowButton, setShouldShowButton] = useState(true);

    const ref = useRef(null);

    const toggleButtonVisibility = () => {
        setShouldShowButton(!(ref?.current?.clientHeight > initialHeight));
    };

    useEffect(() => {
        toggleButtonVisibility();
        window.addEventListener('resize', toggleButtonVisibility);
    }, []);

    const handleShowMore = () => {
        setShowMore(!showMore);
    };

    return (
        <Collapsable
            open={showMore}
            initialHeight={`${initialHeight}px`}
            toggle={
                !shouldShowButton && (
                    <Button style={{ padding: 0 }} onClick={handleShowMore} variant='link' className='show-more'>
                        <span className='purple-14'>
                            {showMore ? (
                                <>
                                    {t('hide')}
                                    <Icon svg={<ArrowUp fill='inherit' />} size='xxs' ml={1} />
                                </>
                            ) : (
                                <>
                                    {t('show')}
                                    <Icon svg={<ArrowDown fill='inherit' />} size='xxs' ml={1} />
                                </>
                            )}
                        </span>
                    </Button>
                )
            }>
            <div ref={ref}>{children}</div>
        </Collapsable>
    );
};

ShowMore.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    initialHeight: PropTypes.number,
};

ShowMore.defaultProps = {
    initialHeight: 25,
};

export default ShowMore;
