import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import serviceContributors from '../../../../services/contributors/contributors';
import serviceAuth from '../../../../services/auth/auth';
import Typeahead from '../../../../components/Typeahead/Typeahead';
import './DropdownCustom.scss';

const DropdownCustom = props => {
    const [contributorsInfo, setcontributorsInfo] = useState([]);
    const [selected, setSelected] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    useEffect(() => {
        setSelected([props.value]);
        getContributorsInfo();
        getUserInfo();
    }, [props.applicationId]);

    const getUserInfo = async () => {
        const res = await serviceAuth.getStatus();
        setUserInfo(res.data.data[0]);
    };

    const getContributorsInfo = async () => {
        const res = await serviceContributors.getContributorsInfo(props.applicationId);
        setcontributorsInfo(res.data.data);
    };

    const handleChange = (value, i) => {
        if (value.length) {
            const name = `${value[0].firstname} ${value[0].lastname}`;
            setSelected([name]);
            props.onChange(value[0]);
        } else {
            props.onChange({ firstname: selected, lastname: '' });
        }
    };

    const filterBy = () => true;

    return (
        <Typeahead
            data-testid='prepopulate'
            id='prepopulate'
            filterBy={filterBy}
            labelKey='firstname'
            onChange={handleChange}
            onInputChange={(text, e) => setSelected([text])}
            options={contributorsInfo}
            selected={selected}
            renderMenuItemChildren={(contributor, props, index) => (
                <div>
                    <div className='margin-top-8 cursorPointer' data-testid={`darContributorDropdownItem${index}`}>
                        <span className='gray800-14' data-testid={`darContributorDropdownName-${index}`}>
                            {contributor.firstname} {contributor.lastname} {contributor.id !== userInfo.id && '(contributor)'}
                        </span>
                        <br />
                        <span className='gray-600-14' data-testid={`darContributorDropdownEmail-${index}`}>
                            {_.has(contributor, 'user.email') ? contributor.user.email : 'Email address cannot be shown'}
                        </span>
                        <span className='gray-600-14 floatRight' data-testid={`darContributorDropdownOrganisation-${index}`}>
                            {contributor.showOrganisation ? contributor.organisation : 'Organisation cannot be shown'}
                        </span>
                    </div>
                </div>
            )}
        />
    );
};

DropdownCustom.defaultProps = {
    value: '',
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
};

export default DropdownCustom;
