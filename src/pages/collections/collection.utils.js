import { Pagination } from 'react-bootstrap';

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

export default {
    generatePaginatedItems
}
