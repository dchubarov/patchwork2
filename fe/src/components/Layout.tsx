import React from "react";
import {Box, BoxProps, GlobalStyles} from "@mui/joy";
import {useActiveView} from "../lib/useActiveView";
import {SidebarPlacement} from "../lib/viewStateTypes";

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

type SidebarProps = BoxProps & {
    placement: SidebarPlacement
}

const Sidebar: React.FC<SidebarProps> = ({placement, children, sx, ...other}) => {
    const {sidebarPlacement} = useActiveView();

    return sidebarPlacement === placement ? (
        <Box {...other}
             sx={[
                 {
                     height: "calc(100dvh - var(--Header-height, 0px))",
                     width: "var(--Sidebar-width)",
                     // overflow: "auto",
                     zIndex: 900,
                     '& > *': {
                         minHeight: '100%'
                     }
                 },
                 ...(Array.isArray(sx) ? sx : [sx])
             ]}>

            <GlobalStyles styles={(/*theme*/) => ({
                ":root": {
                    "--Sidebar-width": "280px"
                }
            })}/>

            {children}
        </Box>
    ) : null;
}

const View: React.FC<BoxProps> = ({sx, ...other}) => (
    <Box {...other}
         component="main"
         sx={[
             {
                 flex: 1,
                 height: "calc(100dvh - var(--Header-height, 0px))",
                 overflow: "auto",
                 '& > *': {
                     minHeight: '100%'
                 }
             },
             ...(Array.isArray(sx) ? sx : [sx])
         ]}/>
);

const defaultExports = {
    Header,
    Main,
    Root,
    Sidebar,
    View
}

export default defaultExports;
