import React, { Fragment, useState } from 'react';
import FilterChip from './FilterChip';
import { FilterCount } from './FilterCount';
import SVGIcon from '../../../images/SVGIcon';
import { Box } from 'hdruk-react-core';

const FilterSelection = ({ selectedCount, selectedItems, onHandleClearSelection, onHandleClearAll, savedSearches }) => {
    const clearSelection = e => {
        e.preventDefault();
        onHandleClearAll();
    };

    const [closed, setClosed] = useState(true);
    const [shouldShowSavedPreferencesModal, setShouldShowSavedPreferenceModal] = useState(false)

    return (
        <Fragment>
            <Box display="flex">
            <Box flexGrow="1">
            <div className={savedSearches ? 'filters saved-filters' : 'filters'}>
                <div className='filters-header'>
                    <div className={savedSearches ? 'filters-title black-16-semibold' : 'filters-title gray500-13'}>
                        Filters applied
                        <div className='filters-title__count'>
                            <FilterCount count={selectedCount} />
                        </div>
                    </div>
                    {selectedCount > 0 ? (
                        <>
                            <div
                                className={
                                    savedSearches ? 'purple-14 saved-filters-title filters-title__clear' : 'purple-13 filters-title__clear'
                                }
                                onClick={e => clearSelection(e)}
                            >
                                {savedSearches ? 'Clear Filters' : 'Clear All'}
                                
                            </div>
                            <button className='saved-search-arrow' onClick={() => (!closed ? setClosed(true) : setClosed(false))}>
                                <SVGIcon
                                    width='20px'
                                    height='20px'
                                    name='chevronbottom'
                                    fill={'#475da7'}
                                    className={closed ? 'flip180' : ''}
                                />
                            </button>
                        </>

                    ) : (
                        ''
                    )}
                </div>
                {closed ? (
                    <div className='filters-body'>
                        {selectedItems.length > 0 &&
                            selectedItems.map(selectedItem => (
                                <FilterChip
                                    key={selectedItem.id}
                                    filterItem={selectedItem}
                                    onHandleClearSelection={onHandleClearSelection}
                                />
                            ))}

                    </div>
                ) : null}                
            </div>
            </Box>
            <Box display="inline-flex" alignItems="flex-end" justifyContent="flex-end">
                <Button
                variant='tertiary'
                className='arrow'
                aria-haspopup='true'
                onClick={
                    this.state.userState[0].loggedIn === false
                        ? () => this.showLoginModal()
                        : () => this.showSavedPreferencesModal(true)
                }>
                Save
                <SVGIcon
                    width='35px'
                    height='35px'
                    name='arrow-down'
                    fill='#3C3C3B'
                    className={this.state.closed ? '' : 'flip180'}
                />{props.children}
            </Button> 
                    {<SavedPreferencesModal
                        show={this.state.shouldShowSavedPreferencesModal}
                        onHide={this.hideSavedPreferencesModal}
                        viewMatchesLink={this.viewMatches}
                        viewSaved={this.saveFiltersUpdate}
                        activeTab={key}
                        saveSuccess={this.showSuccessMessage}
                        saveName={this.showSavedName}
                        search={this.state.search}
                        filters={preferenceFilters}
                        sort={perferenceSort}
                        tab={this.state.key}
                        />
                    }
            </Box>
            </Box>            
        </Fragment>
    );
};

export default FilterSelection;
