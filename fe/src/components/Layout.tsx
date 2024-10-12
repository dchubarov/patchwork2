import React from "react";
import {Box, BoxProps, GlobalStyles, Drawer as JoyDrawer, ModalClose, DialogTitle, DialogContent} from "@mui/joy";
import {SidebarPlacement} from "../lib/viewStateTypes";
import {useActiveView} from "../providers/ActiveViewProvider";

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

const Drawer: React.FC = () => {
    const {drawerOpen, drawerTitle, drawerComponent, closeDrawer, sidebarPlacement} = useActiveView();
    return (
        <JoyDrawer
            open={drawerOpen}
            anchor={sidebarPlacement === "left" ? "right" : "left"}
            onClose={closeDrawer}
            sx={{
                zIndex: 1100,
            }}>
            <ModalClose/>
            {drawerTitle && <DialogTitle>{drawerTitle}</DialogTitle>}
            {drawerComponent && <DialogContent>{drawerComponent}</DialogContent>}
        </JoyDrawer>
    );
}

const defaultExports = {
    Drawer,
    Header,
    Main,
    Root,
    Sidebar,
    View
}

export default defaultExports;
