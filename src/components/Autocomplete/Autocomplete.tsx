import MuiAutocomplete, {AutocompleteProps as MuiAutocompleteProps } from '@mui/material/Autocomplete';
import SearchIcon from "@mui/icons-material/Search";
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

const Autocomplete = (props: MuiAutocompleteProps) => {

    return (
        <MuiAutocomplete
            {...props}
            multiple
            autoSelect
            autoHighlight
            autoComplete
            noOptionsText={""}
            renderInput={(params) => 
                <TextField 
                    {...params} 
                    label={props.label} 
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
            style={{
                    width: "80%",
                    alignItems: "center",
            }}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                <Chip
                    sx= {{margin: 0.1}}
                    color={option.color}
                    label={option.label}
                    key={option.label}
                />
                ))
            }
        />
    );
};

export default Autocomplete;
