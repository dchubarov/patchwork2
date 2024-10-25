import React from "react";
import {Box, Typography} from "@mui/joy";
import AppSettingsMenu from "./AppSettingsMenu";
import SidebarDivider from "./SidebarDivider";
import {SidebarWidget} from "@/types/viewTypes";
import {useActiveView} from "@/hooks";
import AppFeaturesMenu from "./AppFeaturesMenu";

interface SidebarHeaderProps {
    widget?: SidebarWidget | null;
    divider?: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({widget, divider}) => {
    const {currentFeature} = useActiveView();

    return (
        <Box
            sx={{
                px: 2,
                pt: 2,
                top: 0,
                position: "sticky",
                zIndex: 500,
                backdropFilter: "blur(6px)"
            }}>

            {/*APP HEADER*/}
            <Box sx={{display: "flex", flexWrap: "nowrap", alignItems: "center", gap: 1, overflow: "hidden"}}>
                <AppFeaturesMenu/>

                <Typography noWrap level="title-lg" sx={{flexGrow: 1}}>
                    {currentFeature?.localizedDisplayName || "Home"}
                </Typography>

                <AppSettingsMenu/>
            </Box>

            {/*PINNED WIDGET*/}
            {widget?.component && <Box sx={{mt: 3}}>
                {widget.component}
            </Box>}

            {divider && <SidebarDivider sx={{mt: 2}}/>}
        </Box>
    );
}

export default SidebarHeader;
