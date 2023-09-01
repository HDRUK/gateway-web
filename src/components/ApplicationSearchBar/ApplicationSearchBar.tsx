import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Autocomplete from "@/components/Autocomplete";
import {createFilterOptions} from '@mui/material/Autocomplete';
import RadioListFilter from "@/components/RadioListFilter";
import Paper from "@/components/Paper";
import { Typography } from "@mui/material";
import { useState, useEffect, Dispatch, SetStateAction, ChangeEvent } from "react";


interface ApplicationSearchBarProps {
    searchAsYouType?: boolean
    setFilterQuery: Dispatch<SetStateAction<string>>;
}

interface SearchOptionType {
    id?: number;
    name: string;
    label: string;
    type: string;
    create: boolean;
  }

const onlyUnique = (value:string, index:Number, array:[]) => {
    return array.indexOf(value) === index;
}


const ApplicationSearchBar = (props: ApplicationSearchBarProps) => {

    //radio buttons for filtering 
    const statusFilters = [
        {
            value:'',
            label:"Any"
        },
        {
            value:'1',
            label:"Enabled"
        },
        {
            value:'0',
            label:"Disabled"
        },
    ]

    //state for handling which radio button is selected
    const [currentStatusFilter,setCurrentStatusFilter] = useState(statusFilters[0].value);

    //leaving this commented out for now..
    // .. could be used if you want to search as you type... 
    //const [textFilter, setTextFilter] = useState('');
    
    //options for searching text (app name or description) for terms
    //note:
    // - searchOptions is currently just []
    // - in the future we could populate it with options/suggestions returned by the API
    //    - e.g. common words  
    //    - then the user could select from the dropdown list 
    const [searchOptions,setSearchOptions] = useState<SearchOptionType[]>([]);
    const [selectedSearchOptions,setSelectedSearchOptions] = useState<SearchOptionType[]>([]);

    //when the radio buttons are changed, or when the selected search terms are added/removed..
    //update the query string that is used by ApplicationList to populate the list of apps
    useEffect(() => {
        const searchParams = new URLSearchParams();

        //get a list of the text terms to search.. and filter to be unique 
        const textTerms = selectedSearchOptions.map(value => value.name).filter(onlyUnique);

        //keeping this commented out for now...
        // - alternative if we want to also filter as the user types
        //const textTerms = [...selectedSearchOptions.map(value => value.name),
        //                   textFilter].filter(onlyUnique);

        //add the text terms to the URL search params
        textTerms.forEach(term => {
            searchParams.append('text[]',term)
        });
        //add the enabled or not ({0,1}) to the URL search params
        searchParams.append('enabled',currentStatusFilter);

        //update the filter query for the ApplicationList.tsx
        const queryString = searchParams.toString();
        props.setFilterQuery(queryString);
    },[currentStatusFilter,selectedSearchOptions]);  //textFilter


    const filterSearchOptions = (options, state):SearchOptionType[] => {
        const { inputValue } = state;
        const filtered = createFilterOptions<SearchOptionType>()(options,state);

        // commented out for now... gives the ability to search as you type... 
        //wait for 0.5 seconds for the user to stop typing
        /*setTimeout(() => {
            //if the user has entered 3 or more characters..
            if(inputValue.length > 2){
                setTextFilter(inputValue);
            } 
        }, 500);
        */

        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.name);
        if (inputValue !== "" && !isExisting) {
          filtered.push(
            {
                name: inputValue,
                label: `Add "${inputValue}"`,
                type: 'text',
                create: true,
            });
        }
        return filtered;
    }

    const onChangeSearch = (event, newValue, reason, details) => {
        if (reason === 'removeOption') {
            const removeLabel = details.option.label;
            setSelectedSearchOptions(selectedSearchOptions.filter(option => option.label !== removeLabel));
        }    
        else if (details?.option.create && reason !== "removeOption") {
            setSelectedSearchOptions([
                ...selectedSearchOptions, 
                {
                    name: details.option.name,
                    label: details.option.name,
                    type: 'term',
                    create: details.option.create,
                }
            ]);
        } 
        else {
            setSelectedSearchOptions(newValue.map(value => {
                if (typeof value === "string") {
                    return {
                        label: value,
                        create: true,
                      };
                } else {
                    return value;
                }
            }
         ))
        }
    };

    return (
        <>
        <Paper sx={{width:'100%'}}>
        <BoxContainer>
            <BoxContainer>
                <Box >
                    <Typography variant="h2">
                        Application List
                    </Typography>
                </Box>
                <Box sx={{width:'100%'}}>
                    <Autocomplete
                        options={searchOptions}
                        value={selectedSearchOptions}
                        getOptionLabel={(option) => option.label}
                        filterOptions={filterSearchOptions}
                        onChange={onChangeSearch}
                        label={"Search Apps"}
                        //groupBy={(option) => option.type}
                    />
                </Box>
            </BoxContainer>
            <BoxContainer sx={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                <Box>
                    <RadioListFilter
                        title={'App Status:'}
                        options={statusFilters}
                        value={currentStatusFilter}
                        handleChange={setCurrentStatusFilter}
                    />
                </Box>
            </BoxContainer>
        </BoxContainer>
        </Paper>
        </>
    );
};

export default ApplicationSearchBar;
