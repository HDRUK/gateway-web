import MuiCard, { CardProps as MuiCardProps } from "@mui/material/Card";

export type CardProps = MuiCardProps;

const Card = (props: CardProps) => {
    return <MuiCard {...props} />;
};

export default Card;
