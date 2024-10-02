import React, {PropsWithChildren} from "react";
import {Box, Tab, TabList, TabPanel, Tabs, Typography} from "@mui/joy";
import {useActiveView} from "../lib/useActiveView";
import {SidebarPlacement} from "../lib/viewStateTypes";

const paddingSxProps = (sidebarPlacement: SidebarPlacement) => ({
    pl: sidebarPlacement === "left" ? 4 : 2,
    pr: sidebarPlacement === "right" ? 4 : 2,
    py: 2
});

const Content: React.FC<PropsWithChildren> = ({children}) => {
    const {title, sidebarPlacement} = useActiveView();

    return (
        <Box sx={{...paddingSxProps(sidebarPlacement)}}>
            <Box sx={{mb: 2}}>
                {/* TODO show breadcrumbs if available*/}
                <Typography component="h1" level="h2">{title || "!NoViewTitle!"}</Typography>
            </Box>

            {children}
        </Box>
    );
}

const Centered: React.FC<PropsWithChildren> = ({children}) => {
    const {sidebarPlacement} = useActiveView();

    return (
        <Box sx={{
            ...paddingSxProps(sidebarPlacement),
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            {children}
        </Box>
    );
}

// EXPERIMENTAL: displays children in tabs
const Indexed: React.FC<PropsWithChildren> = () => {
    const {sidebarPlacement} = useActiveView();

    return (
        <Tabs defaultValue="a"
              variant="plain"
              orientation="vertical"
              sx={{
                  flexDirection: sidebarPlacement === "left" ? "row-reverse" : "row"
              }}>

            <TabList underlinePlacement={sidebarPlacement} sx={{py: 2}}>
                <Tab indicatorPlacement={sidebarPlacement} value="a">View context playground</Tab>
            </TabList>
            <TabPanel value="a" sx={{...paddingSxProps(sidebarPlacement)}}>
                <Typography level="h2" component="h1">Tab panel</Typography>
            </TabPanel>
        </Tabs>
    );
}

const defaultExports = {
    Centered,
    Content,
    Indexed,
}

export default defaultExports;
