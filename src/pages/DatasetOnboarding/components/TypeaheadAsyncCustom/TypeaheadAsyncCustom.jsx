/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useEffect, useState } from 'react';
import Icon from '../../../../components/Icon';
import Typeahead from '../../../../components/Typeahead/Typeahead';
import serviceLocations from '../../../../services/locations/locations';
import DatasetOnboardingHelperUtil from '../../../../utils/DatasetOnboardingHelper.util';
import { ReactComponent as SearchIcon } from '../../../../images/search.svg';
import * as styles from './TypeaheadAsyncCustom.styles';

function TypeaheadAsyncCustom(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [showIcon, setShowIcon] = useState(true);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (props.value.length) {
            setSelected(getFormattedValues(props.value));
            setShowIcon(false);
        } else {
            setShowIcon(true);
        }
    }, [props.value]);

    const getFormattedValues = values => DatasetOnboardingHelperUtil.getLocationsObj(values);

    const handleSearch = async query => {
        if (isNaN(query)) {
            setIsLoading(true);
            const locations = await serviceLocations.getLocations(query, { withCredentials: false });
            const { data } = locations.data;
            if (data) {
                const options = data.map(i => ({
                    location: i.location,
                    hierarchy: i.hierarchy,
                }));
                setOptions(options);
            }
            setIsLoading(false);
        } else {
            errorHandler(query);
        }
    };

    const handleChange = options => {
        if (options) {
            const value = options.map(i => i.hierarchy);
            setSelected(getFormattedValues(value));
            props.onChange(value);
        }
    };

    const errorHandler = value => {
        setShowError(!isNaN(value));
        setIsLoading(false);
    };

    const handleInputChange = value => {
        errorHandler(value);
    };
    const filterBy = () => true;

    return (
        <div>
            <Typeahead
                css={styles.root(showIcon)}
                filterBy={filterBy}
                emptyLabel=''
                data-testid='async-location'
                id='async-location'
                isLoading={isLoading}
                labelKey='location'
                minLength={3}
                onSearch={handleSearch}
                onChange={handleChange}
                onInputChange={handleInputChange}
                options={options}
                selected={selected}
                iconPrepend={showIcon && !selected.length && <Icon svg={<SearchIcon />} size='lg' fill='green700' />}
                renderMenuItemChildren={({ location, hierarchy }) => (
                    <div className='menu'>
                        <span className='location'>{location}</span>
                        <span className='hierarchy'>{hierarchy}</span>
                    </div>
                )}
                multiple
                async
            />
            {showError && <div className='error'>Please type a valid string</div>}
        </div>
    );
}

TypeaheadAsyncCustom.defaultProps = {
    id: '',
    value: [],
};

export default TypeaheadAsyncCustom;
