import React, {useEffect, useState} from "react";
import {IconButton, IconButtonProps, Tooltip, useColorScheme} from "@mui/joy";
import {DarkMode as DarkModeIcon, LightMode as LightModeIcon} from "@mui/icons-material";

const ColorSchemeToggle: React.FC<IconButtonProps> = (props) => {
    const [mounted, setMounted] = useState(false);
    const {mode, setMode} = useColorScheme();
    const {onClick, ...other} = props;

    useEffect(() => {
        setMounted(true);
    }, [])

    return mounted
        ? (
            <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
                <IconButton
                    variant="outlined"
                    color="neutral"
                    {...other}
                    onClick={(event) => {
                        setMode(mode === "dark" ? "light" : "dark");
                        onClick?.(event);
                    }}>
                    <DarkModeIcon sx={{display: mode === "light" ? "initial" : "none"}}/>
                    <LightModeIcon sx={{display: mode === "dark" ? "initial" : "none"}}/>
                </IconButton>
            </Tooltip>
        ) : (
            <IconButton
                variant="outlined"
                color="neutral"
                {...other}
                disabled
            />
        );
}

export default ColorSchemeToggle;
