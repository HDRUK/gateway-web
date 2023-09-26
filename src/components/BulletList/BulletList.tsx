import { colourType } from "@/config/theme";
import { CheckCircleIcon } from "@/consts/icons";
import { SvgIconComponent } from "@mui/icons-material";

interface BulletListProps {
    items: { label: string }[];
    icon?: SvgIconComponent;
    iconColour?: colourType;
}

const BulletList = ({
    items,
    icon,
    iconColour = "secondary",
}: BulletListProps) => {
    const Icon = icon || CheckCircleIcon;
    return (
        <ul
            style={{
                gap: 8,
                display: "flex",
                flexDirection: "column",
                listStyle: "none",
                padding: 0,
            }}>
            {items.map(item => {
                return (
                    <li
                        key={item.label}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                        }}>
                        <Icon color={iconColour} />
                        {item.label}
                    </li>
                );
            })}
        </ul>
    );
};

export default BulletList;
