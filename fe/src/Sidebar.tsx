import React from "react";
import {
    Accordion,
    accordionClasses,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary, Box,
    Divider,
    Sheet,
    Typography
} from "@mui/joy";
import {useMainView} from "./ViewContext";
// import version from "./version.json"

const Sidebar: React.FC = () => {
    const {widgets, sidebarPlacement} = useMainView();
    const pinnedWidget = (widgets.length > 0 && widgets[0].slot === 0) ? widgets[0] : null;

    return (
        <Sheet variant="plain"
               sx={{
                   display: "flex",
                   flexDirection: "column",
                   borderRight: sidebarPlacement === "left" ? "1px solid" : "none",
                   borderLeft: sidebarPlacement === "right" ? "1px solid" : "none",
                   borderColor: "divider",
                   height: "100%",
                   overflow: "auto"
               }}>

            {pinnedWidget && <>
                <Box sx={{px: 2, pt: 2}}>
                    {pinnedWidget.component}
                </Box>
                {widgets.length > 1 && <Divider sx={{my: 2, boxShadow: "sm"}}/>}
            </>}

            <AccordionGroup
                disableDivider
                sx={{
                    px: 1,
                    height: "100%",
                    overflow: "auto",
                    gap: 1,
                    [`& .${accordionClasses.root}.${accordionClasses.expanded}`]: {
                        backgroundColor: 'background.level1',
                        borderRadius: 'md',
                        borderBottom: '1px solid',
                        borderColor: 'background.level2',
                    },
                }}>

                {widgets.slice(pinnedWidget ? 1 : undefined).map((widget, index) => (
                    <Accordion key={`addon-${index}`} defaultExpanded>
                        <AccordionSummary>
                            <Typography level="body-xs" sx={{textTransform: "uppercase"}} color="neutral">
                                {widget.caption || `Widget-${index + 1}`}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>{widget.component}</AccordionDetails>
                    </Accordion>
                ))}
            </AccordionGroup>

            {/*<Divider/>*/}
            {/*<Typography level="body-sm" p={2}>v{version.version}</Typography>*/}
        </Sheet>
    );
}

export default Sidebar;
