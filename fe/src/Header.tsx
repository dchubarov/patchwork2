import React from "react";
import {Sheet, Typography} from "@mui/joy";
import ColorSchemeToggle from "./ColorSchemeToggle";

const Header: React.FC = () => {
    return (
        <Sheet variant="soft"
               sx={{
                   px: 2,
                   py: "auto",
                   display: "flex",
                   alignItems: "center",
                   height: "var(--Header-height)",
                   borderBottom: "1px solid",
                   borderColor: "divider",
                   boxShadow: "xs"
               }}>

            <Typography sx={{flex: 1}}>
                AppLogo
            </Typography>

            <ColorSchemeToggle variant="plain"/>
        </Sheet>
    );
}

export default Header;
