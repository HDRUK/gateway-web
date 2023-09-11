import { Dispatch, SetStateAction, ChangeEvent } from "react";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';


interface RadioOption {
    value: string;
    label: string;
}

interface CheckboxFilterProps {
    title: string;
    options: RadioOption[];
    value: string|null;
    handleChange: Dispatch<SetStateAction<string|null>>;
}

const CheckboxFilter = (props: CheckboxFilterProps) => {

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const target = (event.target as HTMLInputElement);
        const checked = target.checked; 
        const id =  target.id;
        props.handleChange(checked ? id : null);
    };

    return (
        <FormControl>
            <FormGroup aria-label="position" row
                sx={{ display: 'flex', alignItems: 'center' }}
            >
                <p style={{marginRight:10}}> <b> {props.title}</b> </p>
                {props.options.map(option => (
                    <FormControlLabel 
                        key={option.value}
                        control={
                            <Checkbox
                                id={option.value} 
                                checked={props.value==option.value} 
                                onChange={handleChange} 
                            />
                        } 
                        label={option.label}
                    />
                ))}
            </FormGroup>
        </FormControl>
    );
}

export default CheckboxFilter;