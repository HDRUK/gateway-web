import { Col, Dropdown, Row } from 'react-bootstrap/';
import PropTypes from 'prop-types';
import SVGIcon from '../../images/SVGIcon';
import { getFilterLabel } from './RelatedResourcesTab.utils';

const FilterRow = ({ item, filterType, relatedObjects }) => {
    return (
        <Row
            key={`ddl-item-${item}`}
            className={
                filterType === item
                    ? 'sort-dropdown-item sort-dropdown-item-selected sortingDropdown'
                    : 'sort-dropdown-item sortingDropdown'
            }>
            <Col xs={12} className='p-0'>
                <Dropdown.Item eventKey={item} className='gray800-14'>
                    {getFilterLabel(item, relatedObjects)}
                </Dropdown.Item>
            </Col>
            <div className='p-0 sortingCheckmark'>
                {filterType === item ? (
                    <SVGIcon
                        name='check'
                        width={20}
                        height={20}
                        visble='true'
                        style={{
                            float: 'right',
                            fill: '#3db28c',
                            marginTop: '5px',
                        }}
                        fill='#3db28c'
                        stroke='none'
                    />
                ) : null}
            </div>
        </Row>
    );
};

FilterRow.propTypes = {
    item: PropTypes.string.isRequired,
    filterType: PropTypes.string.isRequired,
    relatedObjects: PropTypes.arrayOf(PropTypes.shape({ objectType: PropTypes.string, objectId: PropTypes.string })).isRequired,
};

export { FilterRow };
