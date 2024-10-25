import React from "react";
import {Box, Sheet} from "@mui/joy";
import {useActiveView} from "../../providers/ActiveViewProvider";
import SidebarDivider from "./SidebarDivider";
import SidebarUserPanel from "./SidebarUserPanel";
import SidebarHeader from "./SidebarHeader";
import SidebarWidgetHost from "./SidebarWidgetHost";

const Sidebar: React.FC = () => {
    const {widgets, sidebarPlacement} = useActiveView();
    const pinnedWidget = (widgets.length > 0 && widgets[0].slot === 0) ? widgets[0] : null;
    const moreWidgets = (widgets.length > 0 && !!widgets.find(
        (value) => value.component && value.slot !== 0))

    return (
        <Box sx={{
            height: "100%",
            py: 2,
            pl: sidebarPlacement === "left" ? 2 : 0,
            pr: sidebarPlacement === "right" ? 2 : 0
        }}>
            {/* SIDEBAR ROOT CONTAINER */}
            <Sheet variant="soft"
                   color="primary"
                   invertedColors
                   sx={{
                       height: "100%",
                       overflowY: "auto",
                       overflowX: "clip",
                       display: "flex",
                       flexDirection: "column",
                       scrollbarWidth: "thin",
                       border: "1px solid",
                       borderColor: "var(--joy-palette-primary-softActiveBg)",
                       borderRadius: "sm",
                       boxShadow: "md",
                   }}>

                {/*APP HEADER & PINNED WIDGET WRAPPER*/}
                <SidebarHeader widget={pinnedWidget} divider={moreWidgets}/>

                {/*MORE WIDGETS*/}
                {<SidebarWidgetHost widgets={widgets}/>}

                {/*FOOTER WRAPPER*/}
                <Box sx={{
                    px: 2,
                    pb: 2,
                    position: "sticky",
                    bottom: 0,
                    zIndex: 501,
                    backdropFilter: "blur(6px)",
                }}>
                    <SidebarDivider sx={{mb: 2}}/>
                    <SidebarUserPanel/>
                </Box>
            </Sheet>
        </Box>
    );
}

export default Sidebar;
