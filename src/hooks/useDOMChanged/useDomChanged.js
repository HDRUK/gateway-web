import isEqual from 'lodash/isEqual';
import { useEffect, useState } from 'react';

const useDOMChanged = ref => {
	const [values, setValues] = useState({
		offsetWidth: null,
	});

	const updateValues = node => {
		const updatedValues = Object.keys(values).reduce((previousValue, currentValue) => {
			return {
				...previousValue,
				[currentValue]: node[currentValue],
			};
		}, {});

		if (!isEqual(values, updatedValues)) setValues(updatedValues);
	};

	useEffect(() => {
		const initValuesChanged = () => {
			updateValues(ref.current);
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
