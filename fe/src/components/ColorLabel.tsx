import _ from "lodash";
import React from "react";
import {Dropdown, IconButton, ListItemDecorator, Menu, MenuButton, MenuItem, useTheme} from "@mui/joy";
import {labelColorsByName} from "../lib/theme";
import {DefaultVariantProp} from "@mui/joy/styles/types";

const Spot: React.FC<{ labelName?: string }> = ({labelName}) => {
    const theme = useTheme();
    const labelColors = labelColorsByName(labelName, theme);

    return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle r={25} cx={50} cy={50}
                    fill={labelName ? labelColors[300] : "transparent"}
                    stroke={labelColors[400]}
                    strokeWidth={5}/>

            {!labelName && <line x1={32} y1={68} x2={68} y2={32}
                                 stroke={labelColors[400]} strokeWidth={5}/>}
        </svg>
    );
}

interface ColorLabelMenuProps {
    showNames?: boolean;
    showNoColor?: boolean;
    onChange?: (value: string | undefined) => void;
}

const MenuItems: React.FC<ColorLabelMenuProps> = ({showNames, showNoColor, onChange}) => {
    const theme = useTheme();
    return (<>
        {Object.keys(theme.palette.colorLabel).map((value) => (
            <MenuItem
                key={`colorLabel-${value}`}
                onClick={() => onChange?.(value)}>
                <ListItemDecorator>
                    <Spot labelName={value}/>
                </ListItemDecorator>
                {showNames && _.capitalize(value)}
            </MenuItem>
        ))}

        {showNoColor && <MenuItem onClick={() => onChange?.(undefined)}>
            <ListItemDecorator>
                <Spot/>
            </ListItemDecorator>
            {showNames && "None"}
        </MenuItem>}
    </>);
}

type SelectorComponentType = React.FC<ColorLabelMenuProps & {
    variant?: DefaultVariantProp;
    size?: "sm" | "md" | "lg";
    selectedLabel?: string;
}>

const Selector: SelectorComponentType = (props) => {
    const handleChange = (value: string | undefined) => {
        if (value !== props.selectedLabel && props.onChange) {
            props.onChange(value);
        }
    }

    return (
        <Dropdown>
            <MenuButton
                slots={{root: IconButton}}
                slotProps={{root: {size: props.size, variant: props.variant}}}>
                <Spot labelName={props.selectedLabel}/>
            </MenuButton>
            <Menu
                variant="outlined"
                placement="bottom-start"
                size={props.size}
                sx={{
                    "--List-padding": "0.25rem",
                    "--ListItem-gap": 1,
                    "--ListItem-minHeight": "1.5rem",
                    "--ListItem-paddingX": "0.25rem",
                    "--ListItemDecorator-size": "1.75rem",
                    "--ListItem-radius": props.showNames ? 0 : "var(--joy-radius-sm)",
                    flexDirection: props.showNames ? "column" : "row",
                    flexWrap: "wrap",
                }}>
                <MenuItems {...props} onChange={handleChange}/>
            </Menu>
        </Dropdown>
    );
}

const ColorLabel = {
    Spot,
    Selector
}

export default ColorLabel;
