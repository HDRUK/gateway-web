import React, { useRef, useState } from 'react';

const usePersistState = () => {
    const ref = useRef({});
    const [state, setState] = useState({});

    const updateState = React.useCallback(
        (key, value) => {
            ref.current = {
                ...ref.current,
                [key]: value,
            };

            setState(ref.current);
        },
        [ref.current]
    );

    return [state, updateState];
};

export default usePersistState;
