import React, {useEffect, useState} from "react";
import {Button, Checkbox, CircularProgress, Stack, Typography} from "@mui/joy";
import {useActiveView} from "../../../lib/useActiveView";
import {IndexedLayoutChildProps} from "../../../lib/pageLayoutTypes";
import ApiPlayground from "./ApiPlayground";

const DemoLoadingWidget: React.FC = () => (
    <Typography
        level="body-sm"
        startDecorator={<CircularProgress variant="solid" size="sm"/>}>
        Loading content...
    </Typography>
);

const ViewContextPlayground: React.FC<IndexedLayoutChildProps> = () => {
    const {configureView, configureWidgets, ejectView, openDrawer} = useActiveView();
    const [slot, setSlot] = useState(1);

    useEffect(() => {
        // Need to eject to remove test widgets
        return () => ejectView();
    }, [ejectView]);

    return (
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

            <Button
                variant="solid"
                onClick={() => openDrawer(<ApiPlayground/>, "API Playground")}>
                Open drawer
            </Button>
        </Stack>
    );
}

ViewContextPlayground.displayName = "ViewContextPlayground";
export default ViewContextPlayground;
