import React, {useEffect, useState} from "react";
import {Box, Button} from "@mui/joy";
import {useViewParameters} from "./ViewContext";

const SampleView2: React.FC = () => {
    const {configureView, configureAddons, ejectView} = useViewParameters();
    const [slot, setSlot] = useState(1);

    useEffect(() => {
        configureView({title: "My Profile", forceSidebar: false});
        return () => ejectView();
    }, [configureView, ejectView]);

    return (
        <Box sx={{p: 2}}>
            <Button variant="solid" onClick={() => {
                configureAddons({component: <div>Add-on #{slot}</div>, slot: slot});
                setSlot(slot + 1);
            }}>Insert add-on</Button>
        </Box>
    );
}

export default SampleView2;
