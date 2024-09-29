import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary,
    Box,
    ListItemContent,
    Sheet,
    Typography
} from "@mui/joy";
import {useMainView} from "./ViewContext";

const Sidebar: React.FC = () => {
    const {widgets, sidebarPlacement} = useMainView();
    const pinnedWidget = (widgets.length > 0 && widgets[0].slot === 0) ? widgets[0] : null;

    return (
        <Box sx={{
            height: "100%",
            py: 2,
            pl: sidebarPlacement === "left" ? 2 : 0,
            pr: sidebarPlacement === "right" ? 2 : 0
        }}>
            <Sheet variant="soft"
                   color="primary"
                   invertedColors
                   sx={{
                       height: "100%",
                       overflow: "scroll",
                       scrollbarWidth: "thin",
                       border: "1px solid",
                       borderColor: "var(--joy-palette-primary-300)",
                       borderRadius: "sm",
                       boxShadow: "md",
                   }}>

                {pinnedWidget && <Box
                    sx={[
                        {
                            p: 2,
                            top: 0,
                            position: "sticky",
                            zIndex: 500,
                            backdropFilter: "blur(6px)"
                        },
                        widgets.length > 1 ? {
                            borderBottom: "1px solid",
                            borderColor: "var(--joy-palette-primary-300)"
                        } : {}
                    ]}>
                    {pinnedWidget.component}
                </Box>}

                {widgets.length > 1 && <AccordionGroup disableDivider sx={{mt: 1}}>
                    {widgets.slice(1).map((widget, index) => (
                        <Accordion key={`widget-${index}`} defaultExpanded>
                            <AccordionSummary>
                                <ListItemContent>
                                    <Typography level="title-sm">
                                        {widget.caption || widget.key}
                                    </Typography>
                                </ListItemContent>
                            </AccordionSummary>
                            <AccordionDetails>{widget.component}</AccordionDetails>
                        </Accordion>
                    ))}
                </AccordionGroup>}
            </Sheet>
        </Box>
    );
}

export default Sidebar;
