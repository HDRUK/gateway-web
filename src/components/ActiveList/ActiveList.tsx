import { SvgIconComponent } from "@mui/icons-material";
import { CircleIcon } from "@/consts/icons";
import { colourType } from "@/config/theme";
import { Typography } from "@mui/material";

interface ActiveListProps {
    items: { label: string }[];
    icon?: SvgIconComponent;
    iconColour?: colourType;
    activeItem: number;
}

const ActiveList = ({
    items,
    icon,
    activeItem = 1,
    iconColour = "primary",
}: ActiveListProps) => {
    const Icon = icon || CircleIcon;
    return (
        <ul
            style={{
                gap: 8,
                display: "flex",
                flexDirection: "column",
                listStyle: "none",
                padding: 0,
            }}>
            {items.map((item, index) => {
                return (
                    <li
                        key={item.label}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                        }}>
                        <Icon
                            color={iconColour}
                            sx={{ opacity: activeItem === index ? 1 : 0.3 }}
                        />
                        <Typography fontSize="14">{item.label}</Typography>
                    </li>
                );
            })}
        </ul>
    );
};

export default ActiveList;
