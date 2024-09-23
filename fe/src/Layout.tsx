import React from "react";
import {Box, BoxProps, GlobalStyles} from "@mui/joy";
import {useViewParameters} from "./ViewContext";

const Root: React.FC<BoxProps> = (props) => (
    <Box {...props}
         sx={[
             {display: "flex", flexDirection: "column", height: "100dvh"},
             ...(Array.isArray(props.sx) ? props.sx : [props.sx])
         ]}/>
);

const Header: React.FC<BoxProps> = (props) => (
    <Box {...props}
         component="header"
         sx={[
             {height: "var(--Header-height)", zIndex: 1000},
             ...(Array.isArray(props.sx) ? props.sx : [props.sx])
         ]}>

        <GlobalStyles styles={(/*theme*/) => ({
            ":root": {
                "--Header-height": "68px"
            }
        })}/>

        {props.children}
    </Box>
);

const Main: React.FC<BoxProps> = (props) => (
    <Box {...props}
         component="main"
         sx={[
             {flex: 1, display: "flex"},
             ...(Array.isArray(props.sx) ? props.sx : [props.sx])
         ]}/>
);

const Sidebar: React.FC<BoxProps> = (props) => {
    const {addons, forceSidebar} = useViewParameters();
    const isVisible = addons.length > 0 || forceSidebar;

    return (
        <Box {...props}
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
                 ...(Array.isArray(props.sx) ? props.sx : [props.sx])
             ]}>

            <GlobalStyles styles={(/*theme*/) => ({
                ":root": {
                    "--Sidebar-width": isVisible ? "240px" : 0
                }
            })}/>

            {props.children}
        </Box>
    );
}

const View: React.FC<BoxProps> = (props) => (
    <Box {...props}
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
             ...(Array.isArray(props.sx) ? props.sx : [props.sx])
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
