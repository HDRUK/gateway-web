import Box from "@/components/Box";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useState, useEffect, Dispatch, SetStateAction, ChangeEvent } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

interface ApplicationSearchBarProps {
    setFilterQuery: Dispatch<SetStateAction<{}>>;
}

interface SearchOptionType {
    name: string,
    label: string,
    type: string,
    create: boolean,
  }

const ApplicationSearchBar = (props: ApplicationSearchBarProps) => {

    const [statusFilter, setStatusFilter] = useState('');
    const [textFilter, setTextFilter] = useState('');

    useEffect(() => {
        const searchParams = {
            text: textFilter,
            enabled:statusFilter,
        }
        const queryString = new URLSearchParams(searchParams).toString();
        console.log(queryString);
        props.setFilterQuery(queryString);
    },[statusFilter,textFilter]);

    //[{label:'test',type:'test2'}];
    const [searchOptions,setSearchOptions] = useState<SearchOptionType[]>([]);
    const [selectedSearchOptions,setSelectedSearchOptions] = useState<SearchOptionType[]>([]);

    const handleChangeStatusFilter = (event: ChangeEvent<HTMLInputElement>) => {
        let status = (event.target as HTMLInputElement).value;  
        setStatusFilter(status);
    };

    const filterSearchOptions = (options,state) => {
        const { inputValue } = state;
        const results = createFilterOptions<SearchOptionType>()(options,state);
        
        //const filterOptions = createFilterOptions<SearchOptionType>(options,state);
        //console.log(filterOptions);
        //wait for 0.5 seconds for the user to stop typing
        setTimeout(() => {
            //if the user has entered 3 or more characters..
            const textSearch = inputValue.length > 2 ? inputValue : '';
            setTextFilter(textSearch);
        }, 500);

  
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.name);
        if (inputValue !== "" && !isExisting) {
          results.push(
            {
                name: inputValue,
                label: `Add "${inputValue}"`,
                type: 'text',
                create: true,
            });
        }

        //setSearchParams(newSearchParams);
        return results;
        /*return options.filter((item) =>
                String(item.label)
                .toLowerCase()
                .includes(state.inputValue.toLowerCase())
        );*/
    }

    return (
        <>
        <Box>
            <Autocomplete
                multiple
                id="app-list-search"
                options={searchOptions}
                value={selectedSearchOptions}
                getOptionLabel={(option) => option.label}
                filterOptions={filterSearchOptions}
                onChange={(event, newValue, reason, details) => {
                    if (details?.option.create && reason !== "removeOption") {
                        setSelectedSearchOptions([...selectedSearchOptions, {
                            label: details.option.name,
                            type: 'term',
                            create: details.option.create,
                        }]);
                    } 
                    else {
                        setSelectedSearchOptions(newValue.map(value => {
                            if (typeof value === "string") {
                                return {
                                    label: value,
                                    create: true,
                                  }
                            } else {
                                return value
                            }
                        }
                     ))
                    }
                }}
                renderInput={(params) => 
                    <TextField 
                        {...params} 
                        label="Search Apps" 
                        InputProps={{ 
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
                                  { params.InputProps.startAdornment }
                                </InputAdornment>
                            )
                        }}
                    />
                }
                groupBy={(option) => option.type}
                style={{
                        width: "800px",
                        alignItems: "center",
                }}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        color={option.color}
                        label={option.label}
                      />
                    ))}
            />
            <FormControl
                sx={{
                        marginTop: 1,
                }}
            >
                <FormLabel id="app-list-status-filter">App Status: </FormLabel>
                <RadioGroup
                    row
                    value={statusFilter}
                    onChange={handleChangeStatusFilter}
                >
                    <FormControlLabel value={''} control={<Radio />} label="Any" />
                    <FormControlLabel value={'1'} control={<Radio />} label="Enabled" />
                    <FormControlLabel value={'0'} control={<Radio />} label="Disabled" />
                </RadioGroup>
            </FormControl>
        </Box>
        </>
    );
};

export default ApplicationSearchBar;
