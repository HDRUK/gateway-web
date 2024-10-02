import { SvgIconComponent } from "@mui/icons-material";
import { Typography } from "@mui/material";
import Button from "@/components/Button";
import { colourType } from "@/config/theme";
import { CircleIcon } from "@/consts/icons";

interface ActiveListProps {
    items: { label: string }[];
    icon?: SvgIconComponent;
    iconColour?: colourType;
    activeItem: number;
    handleClick: (id: number) => void;
}

const ActiveList = ({
    items,
    icon,
    handleClick,
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
                        <Button
                            onClick={() => handleClick(index + 1)}
                            variant="link"
                            sx={{
                                whiteSpace: "inherit",
                                textAlign: "left",
                            }}
                            startIcon={
                                <Icon
                                    color={iconColour}
                                    sx={{
                                        opacity:
                                            activeItem === index + 1 ? 1 : 0.3,
                                        transition: "opacity 0.2s, lineBreak",
                                    }}
                                />
                            }>
                            <Typography fontSize="14">{item.label}</Typography>
                        </Button>
                    </li>
                );
            })}
        </ul>
    );
};

export default ActiveList;
