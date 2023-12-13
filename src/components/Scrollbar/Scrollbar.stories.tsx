import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import Form from "@/components/Form";
import Box from "@/components/Box";
import { Stack } from "@mui/material";
import Scrollbar from "./Scrollbar";

const meta: Meta<typeof Scrollbar> = {
    component: Scrollbar,
    title: "Forms/Scrollbar",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Scrollbar>;

const WrapperComponent = () => {
    return (
        <Box sx={{ width: "20%" }}>
            <Scrollbar>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Nec
                ultrices dui sapien eget mi. Convallis aenean et tortor at risus
                viverra adipiscing at. Aliquet eget sit amet tellus cras. Et
                ligula ullamcorper malesuada proin libero. Lacinia quis vel eros
                donec ac odio tempor orci dapibus. Lacus viverra vitae congue eu
                consequat ac. Dictum sit amet justo donec enim diam vulputate ut
                pharetra. Varius quam quisque id diam. Pellentesque elit eget
                gravida cum sociis natoque penatibus et. Ipsum dolor sit amet
                consectetur adipiscing. Neque viverra justo nec ultrices dui
                sapien. Donec et odio pellentesque diam volutpat. Dictum at
                tempor commodo ullamcorper a lacus vestibulum sed arcu. Sodales
                ut etiam sit amet nisl purus in. Arcu vitae elementum curabitur
                vitae nunc sed velit dignissim sodales. Iaculis eu non diam
                phasellus vestibulum lorem sed risus ultricies. Suscipit tellus
                mauris a diam maecenas sed enim. Sagittis aliquam malesuada
                bibendum arcu vitae elementum. Sed lectus vestibulum mattis
                ullamcorper velit. Sed pulvinar proin gravida hendrerit lectus
                a. In vitae turpis massa sed. Elementum facilisis leo vel
                fringilla est ullamcorper. Nisl nunc mi ipsum faucibus vitae
                aliquet. Vulputate mi sit amet mauris commodo quis imperdiet
                massa. Sit amet nisl purus in mollis nunc. Leo urna molestie at
                elementum eu facilisis sed odio. Pulvinar neque laoreet
                suspendisse interdum consectetur libero. Diam maecenas sed enim
                ut sem. Nullam non nisi est sit amet facilisis magna. Proin nibh
                nisl condimentum id venenatis. Est ante in nibh mauris cursus
                mattis molestie a. Tempor orci eu lobortis elementum nibh tellus
                molestie nunc. Scelerisque purus semper eget duis at. Tempus
                imperdiet nulla malesuada pellentesque elit eget. Morbi
                tincidunt augue interdum velit euismod in pellentesque massa
                placerat. Ridiculus mus mauris vitae ultricies leo integer.
                Viverra mauris in aliquam sem fringilla ut morbi tincidunt
                augue. Vulputate odio ut enim blandit. Molestie a iaculis at
                erat pellentesque adipiscing commodo elit at. Pellentesque
                adipiscing commodo elit at imperdiet dui accumsan sit amet.
                Ipsum suspendisse ultrices gravida dictum fusce ut. Adipiscing
                commodo elit at imperdiet dui accumsan sit amet nulla. Egestas
                quis ipsum suspendisse ultrices gravida dictum fusce ut
                placerat. Euismod lacinia at quis risus. Auctor urna nunc id
                cursus metus aliquam. Dui id ornare arcu odio ut sem nulla
                pharetra diam. Enim praesent elementum facilisis leo vel
                fringilla est. Quisque id diam vel quam elementum pulvinar
                etiam. Mauris a diam maecenas sed. Sit amet consectetur
                adipiscing elit. Ornare lectus sit amet est placerat in.
                Bibendum enim facilisis gravida neque convallis a cras semper
                auctor. Sit amet cursus sit amet. Cras ornare arcu dui vivamus
                arcu. Amet purus gravida quis blandit turpis cursus in. Aenean
                et tortor at risus viverra adipiscing. Tellus cras adipiscing
                enim eu turpis egestas pretium aenean. Pellentesque elit
                ullamcorper dignissim cras tincidunt lobortis. Amet venenatis
                urna cursus eget nunc scelerisque. Amet aliquam id diam maecenas
                ultricies mi eget. Id eu nisl nunc mi ipsum faucibus.
            </Scrollbar>
        </Box>
    );
};

export const Default: Story = {
    render: () => <WrapperComponent />,
};
