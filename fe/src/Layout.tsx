import React from "react";
import {Box, BoxProps, GlobalStyles} from "@mui/joy";
import {useViewParameters} from "./ViewContext";

const Root: React.FC<BoxProps> = ({sx, ...other}) => (
    <Box {...other}
         sx={[
             {display: "flex", flexDirection: "column", height: "100dvh"},
             ...(Array.isArray(sx) ? sx : [sx])
         ]}/>
);

const Header: React.FC<BoxProps> = ({children, sx, ...other}) => (
    <Box {...other}
         component="header"
         sx={[
             {height: "var(--Header-height)", zIndex: 1000},
             ...(Array.isArray(sx) ? sx : [sx])
         ]}>

        <GlobalStyles styles={(/*theme*/) => ({
            ":root": {
                "--Header-height": "68px"
            }
        })}/>

        {children}
    </Box>
);

const Main: React.FC<BoxProps> = ({sx, ...other}) => (
    <Box {...other}
         component="main"
         sx={[
             {flex: 1, display: "flex"},
             ...(Array.isArray(sx) ? sx : [sx])
         ]}/>
);

const Sidebar: React.FC<BoxProps> = ({children, sx, ...other}) => {
    const {addons, forceSidebar} = useViewParameters();
    const isVisible = addons.length > 0 || forceSidebar;

    return (
        <Box {...other}
             sx={[
                 {
                     display: isVisible ? "initial" : "none",
                     height: "calc(100vh - var(--Header-height))",
                     width: "var(--Sidebar-width)",
                     overflow: "auto",
                     zIndex: 900,
                     '& > *': {
                         minHeight: '100%'
                     }
                 },
                 ...(Array.isArray(sx) ? sx : [sx])
             ]}>

            <GlobalStyles styles={(/*theme*/) => ({
                ":root": {
                    "--Sidebar-width": isVisible ? "260px" : 0
                }
            })}/>

            {children}
        </Box>
    );
}

const View: React.FC<BoxProps> = ({sx, ...other}) => (
    <Box {...other}
         component="main"
         sx={[
             {
                 flex: 1,
                 height: "calc(100vh - var(--Header-height))",
                 overflow: "auto",
                 '& > *': {
                     minHeight: '100%'
                 }
             },
             ...(Array.isArray(sx) ? sx : [sx])
         ]}/>
);

const layoutBoxes = {
    Header,
    Main,
    Root,
    Sidebar,
    View
}

export default layoutBoxes;
