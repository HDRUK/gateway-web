import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ReactComponent as MetadataBronze } from '../../images/bronzeNew.svg';
import { ReactComponent as MetadataGold } from '../../images/goldNew.svg';
import { ReactComponent as MetadataNotRated } from '../../images/notRatedNew.svg';
import { ReactComponent as MetadataPlatinum } from '../../images/platinumNew.svg';
import { ReactComponent as MetadataSilver } from '../../images/silverNew.svg';
import ToolTip from '../ToolTip';

const iconMappings = {
    'Not Rated': MetadataNotRated,
    Bronze: MetadataBronze,
    Silver: MetadataSilver,
    Gold: MetadataGold,
    Platinum: MetadataPlatinum,
};

const QualityScore = ({ rating, score, completenessPercent, errorPercent }) => {
    const { t } = useTranslation();

    const IconComponent = iconMappings[rating];

    if (!IconComponent) return null;

    return (
        <ToolTip
            placement='bottom'
            text={
                <span
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: t('components.QualityScore.tooltip', {
                            score: Math.trunc(score),
                            completeness_percent: Math.trunc(completenessPercent),
                            error_percent: Math.trunc(errorPercent),
                        }),
                    }}
                />
            }>
            <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://github.com/HDRUK/datasets/tree/master/reports#hdr-uk-data-documentation-scores'>
                <IconComponent />
            </a>
        </ToolTip>
    );
};

QualityScore.propTypes = {
    errorPercent: PropTypes.number.isRequired,
    completenessPercent: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    rating: PropTypes.oneOf(['Not Rated', 'Bronze', 'Silver', 'Gold', 'Platinum']),
};

QualityScore.defaultProps = {
    rating: 'Not Rated',
};

export default QualityScore;
