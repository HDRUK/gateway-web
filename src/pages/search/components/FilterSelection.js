import { useState } from 'react';
import { Caption, Box, Icon, Button } from 'hdruk-react-core';
import FilterChip from './FilterChip';
import { FilterCount } from './FilterCount';
import { ReactComponent as ChevronBottomIcon } from '../../../images/chevron-bottom.svg';

const FilterSelection = ({ selectedCount, selectedItems, onHandleClearSelection, onHandleClearAll, savedSearches }) => {
    const clearSelection = e => {
        e.preventDefault();
        onHandleClearAll();
    };

    const [closed, setClosed] = useState(true);

    return (
        <Box display='flex' flexDirection='column'>
            <Box display='flex' alignItems='center'>
                <Caption>Filters applied</Caption>
                <Box mr={2} className='filters-title__count'>
                    <FilterCount count={selectedCount} />
                </Box>
                {selectedCount > 0 ? (
                    <>
                        <div
                            className={
                                savedSearches ? 'purple-14 saved-filters-title filters-title__clear' : 'purple-13 filters-title__clear'
                            }
                            onClick={e => clearSelection(e)}>
                            {savedSearches ? 'Clear Filters' : 'Clear All'}
                        </div>
                        <Button
                            ml={1}
                            variant='secondaryAlt'
                            iconLeft={
                                <Icon
                                    className={closed ? 'flip180' : ''}
                                    fill='#475da7'
                                    size='xl'
                                    svg={<ChevronBottomIcon fill='inherit' />}
                                />
                            }
                            onClick={() => (!closed ? setClosed(true) : setClosed(false))}
                        />
                    </>
                ) : (
                    ''
                )}
            </Box>
            {closed ? (
                <div className='filters-body'>
                    {selectedItems.length > 0 &&
                        selectedItems.map(selectedItem => (
                            <FilterChip key={selectedItem.id} filterItem={selectedItem} onHandleClearSelection={onHandleClearSelection} />
                        ))}
                </div>
            ) : null}
        </Box>
    );
};

export default FilterSelection;
