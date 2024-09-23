import React from "react";
import {Divider, Link, Sheet, Typography} from "@mui/joy";
import {Link as RouterLink} from "react-router-dom";
import ColorSchemeToggle from "./ColorSchemeToggle";
import {useViewParameters} from "./ViewContext";

const Header: React.FC = () => {
    const {title} = useViewParameters();

    return (
        <Sheet variant="soft"
               sx={{
                   px: 2,
                   py: "auto",
                   height: "var(--Header-height)",
                   borderBottom: "1px solid",
                   borderColor: "divider",
                   boxShadow: "xs",

                   display: "flex",
                   alignItems: "center",
                   gap: 2
               }}>

            <Typography level="title-lg">{title || "!NoViewTitle!"}</Typography>
            <Link component={RouterLink} to="/" variant="soft">Home</Link>
            <Link component={RouterLink} to="/users/profile" variant="soft">Profile</Link>
            <Divider sx={{backgroundColor: "transparent", flexGrow: 1}}/>
            <ColorSchemeToggle variant="plain"/>
        </Sheet>
    );
}

export default Header;
