import React from "react";
import {AspectRatio, Divider, Link, Sheet, Typography} from "@mui/joy";
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


            {/*TODO logo depending on color scheme*/}
            <AspectRatio ratio="1" sx={{
                minWidth: 42,
                filter: "grayscale(.5)",
                transition: "transform .3s ease-in-out, grayscale .3s ease-in-out",
                ":hover": {
                    transform: "rotate(-90deg)",
                    filter: "grayscale(0)"
                }
            }}>
                <img src={process.env.PUBLIC_URL + "/logo192.png"} alt="Logo"/>
            </AspectRatio>

            <Typography level="title-lg">{title || "!NoViewTitle!"}</Typography>
            <Link component={RouterLink} to="/" variant="soft">Home</Link>
            <Link component={RouterLink} to="/dev/view-context-playground" variant="soft">Dev</Link>
            <Divider sx={{backgroundColor: "transparent", flexGrow: 1}}/>
            <ColorSchemeToggle variant="plain"/>
        </Sheet>
    );
}

export default Header;
