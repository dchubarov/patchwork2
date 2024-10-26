import React from "react";
import {Accordion, AccordionDetails, AccordionGroup, AccordionSummary, ListItemContent, Typography} from "@mui/joy";
import {SidebarWidget} from "@/types/view";

interface SidebarWidgetHostProps {
    widgets: SidebarWidget[];
}

const SidebarWidgetHost: React.FC<SidebarWidgetHostProps> = ({widgets}) => {
    return (
        <AccordionGroup disableDivider sx={{mt: 1}}>
            {widgets.filter((widget) => widget.slot !== 0).map((widget) => (
                <Accordion key={`widget-${widget.slot}`} defaultExpanded>
                    <AccordionSummary>
                        <ListItemContent>
                            <Typography level="title-sm">
                                {widget.caption || widget.key}
                            </Typography>
                        </ListItemContent>
                    </AccordionSummary>
                    <AccordionDetails>
                        {widget.component}
                    </AccordionDetails>
                </Accordion>
            ))}
        </AccordionGroup>
    );
}

export default SidebarWidgetHost;
