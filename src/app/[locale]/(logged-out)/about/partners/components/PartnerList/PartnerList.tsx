"use client";

import { Typography } from "@mui/material";
import { Partner } from "@/interfaces/Partners";
import HTMLContent from "@/components/HTMLContent";
import { Description, Item, List, Logo } from "./PartnerList.styles";

interface PartnerListProps {
    partners: Partner[];
}

const PartnerList = ({ partners }: PartnerListProps) => (
    <List>
        {partners.map(({ title, description, image }) => (
            <Item key={title}>
                {image && (
                    <Logo src={image.node.sourceUrl} alt={image.node.altText} />
                )}
                <div>
                    <Typography variant="articleLead" component="h3">
                        {title}
                    </Typography>
                    {description && (
                        <Description>
                            <HTMLContent content={description} />
                        </Description>
                    )}
                </div>
            </Item>
        ))}
    </List>
);

export default PartnerList;
