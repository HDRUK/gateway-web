import React, { Component, useState } from 'react';
import { Row, Col, InputGroup, FormText, Dropdown } from 'react-bootstrap';
import _ from 'lodash';
import { ReactComponent as ChevronRight } from '../../images/chevron-right.svg';
import './Search.scss';

const CustomToggle = React.forwardRef(({ children, onClick, title }, ref) => (
    <a
        href='javascript:void(0)'
        aria-label={'Filter for ' + title}
        ref={ref}
        onClick={e => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
    </a>
));

const CustomMenu = React.forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value] = useState('');

    return (
        <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
            <ul className='list-unstyled'>
                {React.Children.toArray(children).filter(child => !value || child.props.children.toLowerCase().startsWith(value))}
            </ul>
        </div>
    );
});

class Filters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data || [],
            selected: props.selected || [],
            title: props.title || '',
            allFilters: props.allFilters && props.length !== 0 ? props.allFilters : [],
            filterOpen: false,
            isKeyValue: props.isKeyValue,
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            data: props.data || [],
            selected: props.selected || [],
            title: props.title || '',
            allFilters: props.allFilters && props.length !== 0 ? props.allFilters : [],
            isKeyValue: props.isKeyValue,
        });
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    handleClick = e => {
        try {
            if (this.filterButton.contains(e.target)) {
                if (this.state.filterOpen === true) {
                    this.setState({ filterOpen: false });
                } else {
                    this.setState({ filterOpen: true });
                }
            } else {
                if (!this.filterHolder.contains(e.target)) {
                    this.setState({ filterOpen: false });
                }
            }
        } catch (e) {
            this.setState({ filterOpen: false });
        }
    };

    changeFilter = e => {
        const selected = this.state.selected;
        let index;

        if (e.target.checked) {
            selected.push(e.target.value);
        } else {
            index = selected.indexOf(e.target.value);
            selected.splice(index, 1);
        }

        this.setState({ selected });
        this.props.updateOnFilter();
    };

    clearFilter = () => {
        const selected = this.state.selected;
        while (selected.length) {
            selected.pop();
        }
        this.props.updateOnFilter();
    };

    render() {
        const { data, selected, title, filterOpen, allFilters, isKeyValue } = this.state;

        let filterCard = 'filterCard mb-1';
        if (filterOpen) {
            filterCard = 'filterCardSelected mb-1';
        }

        return (
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} title={title} ref={filterButton => (this.filterButton = filterButton)}>
                    <div className={filterCard}>
                        <Row className=''>
                            <Col xs={12}>
                                <div className='inlineBlock'>
                                    <span className='gray800-14-bold'>{title}</span>
                                </div>

                                <div className='floatRight'>
                                    <ChevronRight />
                                </div>
                                {selected.length === 0 ? (
                                    <span />
                                ) : (
                                    <div className='white-12-bold bubbleCount floatRight'> {selected.length} </div>
                                )}
                            </Col>
                        </Row>
                    </div>
                </Dropdown.Toggle>

                <Dropdown.Menu as={CustomMenu} className='filterMenu' ref={filterHolder => (this.filterHolder = filterHolder)}>
                    <div className='filterMenuHeader'>
                        <div className='inlineBlock'>
                            <div className='gray500-13'>{selected.length} selected</div>
                        </div>
                        <div className='floatRight'>
                            {selected.length !== 0 ? (
                                <div className='purple-13 pointer' onClick={() => this.clearFilter()}>
                                    Clear all
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>

                    <div className='filterMenuInner'>
                        {_.isEmpty(allFilters)
                            ? ''
                            : allFilters.map(filter => {
                                  let filterClass = 'gray800-14 ml-4 mt-2 mb-2 pb-1';

                                  if (
                                      (isKeyValue !== true && data && !data.includes(filter)) ||
                                      (isKeyValue === true && data && data.filter(dat => dat.value === filter.value).length === 0)
                                  ) {
                                      filterClass = 'gray800-14-opacity ml-4 mt-2 mb-2 pb-1';
                                  }

                                  return (
                                      <InputGroup>
                                          <InputGroup.Prepend>
                                              <InputGroup.Checkbox
                                                  aria-label='Checkbox for following text input'
                                                  name='publisher'
                                                  checked={
                                                      (isKeyValue === true && selected.indexOf(filter.result.toString()) !== -1) ||
                                                      (isKeyValue !== true && selected.indexOf(filter) !== -1)
                                                          ? 'true'
                                                          : ''
                                                  }
                                                  value={isKeyValue === true ? filter.result : filter}
                                                  onChange={this.changeFilter}
                                              />
                                          </InputGroup.Prepend>
                                          <FormText className={filterClass}>{isKeyValue === true ? filter.value : filter}</FormText>
                                      </InputGroup>
                                  );
                              })}
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default Filters;
