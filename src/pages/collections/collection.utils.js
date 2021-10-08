import { Pagination } from 'react-bootstrap';
import { DATASET, PERSON, RELEVANCE, POPULARITY, RECENTLYADDED, RESOURCES, METADATA } from './constants';

const generatePaginatedItems = (key, count, index, paginate) => {
    const items = [];
    const maxResult = 24;

    for (let i = 1; i <= Math.ceil(count / maxResult); i++) {
        items.push(
            <Pagination.Item
                key={i}
                active={i === index + 1}
                onClick={e => {
                    paginate(key, i - 1);
                }}>
                {i}
            </Pagination.Item>
        );
    }

    return items;
}

const generateDropdownItems = key => {
    if (key === DATASET) {
        dropdownItems = [RELEVANCE, POPULARITY, RECENTLYADDED, RESOURCES, METADATA];
    } else if (key === PERSON) {
        dropdownItems = [RELEVANCE, POPULARITY, RECENTLYADDED];
    } else {
        dropdownItems = [RELEVANCE, POPULARITY, RECENTLYADDED, RESOURCES];
    }
}

export default {
    generatePaginatedItems,
    generateDropdownItems
}
