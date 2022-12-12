import isEqual from 'lodash/isEqual';
import { useEffect, useState } from 'react';

const useDOMChanged = (
    ref,
    atts = {
        offsetWidth: null,
    }
) => {
    const [values, setValues] = useState(atts);

    const updateValues = node => {
        const updatedValues = Object.keys(values).reduce((previousValue, key) => {
            return {
                ...previousValue,
                [key]: !!node[key] ? node[key] : previousValue[key],
            };
        }, {});

        if (!isEqual(values, updatedValues)) setValues(updatedValues);
    };

    useEffect(() => {
        const initValuesChanged = () => {
            if (ref.current) updateValues(ref.current);
        };

        if (ref.current) ref.current.addEventListener('DOMSubtreeModified', initValuesChanged);

        return () => {
            if (ref.current) ref.current.removeEventListener('DOMSubtreeModified', initValuesChanged);
        };
    }, [ref.current]);

    useEffect(() => {
        if (ref.current) {
            updateValues(ref.current);
        }
    }, [ref.current && ref.current.offsetWidth]);

    return values;
};

export default useDOMChanged;
