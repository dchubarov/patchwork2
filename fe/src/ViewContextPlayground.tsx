import React, {useEffect, useState} from "react";
import {Box, Button, Stack} from "@mui/joy";
import {useMainView} from "./ViewContext";

const ViewContextPlayground: React.FC = () => {
    const {configureView, configureWidgets, ejectView} = useMainView();
    const [slot, setSlot] = useState(1);

    useEffect(() => {
        configureView({title: "View context playground"});
        return () => ejectView();
    }, [configureView, ejectView]);

    return (
        <Box sx={{p: 2}}>
            <Stack gap={2} alignItems="flex-start">
                <Button variant="solid" onClick={() => {
                    configureWidgets({component: <div>Add-on #{slot}</div>, slot: slot});
                    setSlot(slot + 1);
                }}>Insert add-on</Button>
            </Stack>
        </Box>
    );
}

export default ViewContextPlayground;
