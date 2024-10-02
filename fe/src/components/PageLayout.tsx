import React, {PropsWithChildren} from "react";
import {Box, Typography} from "@mui/joy";
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

const defaultExports = {
    Content,
    Centered
}

export default defaultExports;
