import React, {useEffect, useState} from "react";
import {Box, Button, Checkbox, CircularProgress, Stack, Typography} from "@mui/joy";
import {useMainView} from "./ViewContext";

const DemoLoadingWidget: React.FC = () => (
    <Typography
        level="body-sm"
        startDecorator={<CircularProgress variant="solid" size="sm"/>}>
        Loading content...
    </Typography>
);

const ViewContextPlayground: React.FC = () => {
    const {configureView, configureWidgets, ejectView, widgets} = useMainView();
    const [slot, setSlot] = useState(1);

    useEffect(() => {
        configureView({title: "View context playground", sidebarPlacement: "left"});
        // configureWidgets({component: <DemoLoadingWidget/>, slot: 0})
        return () => ejectView();
    }, [configureView, ejectView]);

    return (
        <Box sx={{p: 2}}>
            <Stack gap={2} alignItems="flex-start">
                <Button variant="solid" onClick={() => {
                    configureWidgets({
                        component: <Typography level="body-sm">Widget contents</Typography>,
                        caption: `Widget ${slot}`,
                        slot: slot
                    });
                    setSlot(slot + 1);
                }}>Add widget</Button>

                <Checkbox label="Place sidebar on the right"
                          onChange={(e) => {
                              configureView({sidebarPlacement: e.target.checked ? "right" : "left"});
                          }}/>

                <Checkbox label="Show pinned widget"
                          onChange={(e) => {
                              configureWidgets({slot: 0, component: e.target.checked ? <DemoLoadingWidget/> : null});
                          }}/>
            </Stack>
        </Box>
    );
}

export default ViewContextPlayground;
