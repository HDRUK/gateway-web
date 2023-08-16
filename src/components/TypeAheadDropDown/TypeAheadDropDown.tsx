/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions

/** @jsxImportSource @emotion/react */

import TextField from "@/components/TextField";
import { TextFieldBaseProps } from "@/components/TextFieldBase/TextFieldBase";
import { Team } from "@/interfaces/Team";
import { User } from "@/interfaces/User";
import { useState } from "react";
import { useTheme } from "@emotion/react";

import * as styles from "./TypeAheadDropDown.styles";

interface TypeAheadDropDownProps extends TextFieldBaseProps {
    items: Team;
}

const TypeAheadDropDown = (props: TypeAheadDropDownProps) => {
    const theme = useTheme();
    const [suggestions, setSuggestions] = useState<User>([]);
    const [memberSearchName, setMemberSearchName] = useState("");
    const [suggestionItemSelected, setSuggestionItemSelected] = useState<User>(
        {}
    );

    const suggestionSelected = (item: any) => {
        setSuggestionItemSelected(item);
        setSuggestions([]);
        setMemberSearchName(item.name);
    };

    const renderSelections = () => {
        return (
            <ul>
                {suggestions.map(item => (
                    <li key={item.id} onClick={() => suggestionSelected(item)}>
                        {item.name}
                    </li>
                ))}
            </ul>
        );
    };

    const onChange = (event: any) => {
        let suggestionsList = [];
        const { value } = event.target;
        setMemberSearchName(value);

        // eslint-disable-next-line react/destructuring-assignment
        const usersList = props.items.users;

        if (value.length > 0) {
            // eslint-disable-next-line security/detect-non-literal-regexp
            const regex = new RegExp(`${value}`, `i`);
            suggestionsList = usersList.filter(v => {
                console.log(`testing ${value} vs ${v.name}`);
                return regex.test(v.name);
            });
        }

        setSuggestions(suggestionsList);
    };

    return (
        <div css={styles.typeAheadDropDown(theme, "primary")}>
            <TextField 
                sx={{
                    width: "250px",
                    marginRight: "10px",
                }}
                {...props}
                onChange={onChange}
                value={memberSearchName}
                placeholder="Search Team Members..."
                css={styles.typeAheadDropDown(theme, "primary")}
            />
            {renderSelections()}
        </div>
    );
};

export default TypeAheadDropDown;
