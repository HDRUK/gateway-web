import { useEffect, ChangeEvent } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


interface RadioOption {
    value: string;
    label: string;
}

interface RadioListFilterProps {
    title: string;
    options: RadioOption[];
    value: string;
    handleChange: (value: string) => void;
}

const RadioListFilter = (props: RadioListFilterProps) => {

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        let value = (event.target as HTMLInputElement).value;  
        props.handleChange(value);
    };

    return (
        <FormControl>
            <FormLabel>{props.title} </FormLabel>
            <RadioGroup
                row
                value={props.value}
                onChange={handleChange}
            >
                {props.options.map(option => (
                    <FormControlLabel 
                        key={`radio-list-key-${option.label}`}
                        value={option.value} 
                        control={<Radio />} 
                        label={option.label}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
}

export default RadioListFilter;