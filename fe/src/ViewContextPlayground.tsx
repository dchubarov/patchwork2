import React, {useEffect, useState} from "react";
import {Box, Button, Checkbox, Stack} from "@mui/joy";
import {useViewParameters} from "./ViewContext";

const ViewContextPlayground: React.FC = () => {
    const {forceSidebar, configureView, configureAddons, ejectView} = useViewParameters();
    const [slot, setSlot] = useState(1);

    useEffect(() => {
        configureView({title: "View context playground", forceSidebar: false});
        return () => ejectView();
    }, [configureView, ejectView]);

    return (
        <Box sx={{p: 2}}>
            <Stack gap={2} alignItems="flex-start">
                <Checkbox size="sm"
                          label={<span style={{fontStyle: "italic"}}>Force sidebar</span>}
                          checked={forceSidebar || false}
                          onChange={(e) => configureView({forceSidebar: e.target.checked})}/>

                <Button variant="solid" onClick={() => {
                    configureAddons({component: <div>Add-on #{slot}</div>, slot: slot});
                    setSlot(slot + 1);
                }}>Insert add-on</Button>
            </Stack>
        </Box>
    );
}

export default ViewContextPlayground;
