import React, {useEffect} from "react";
import {Box, Sheet, Typography} from "@mui/joy";
import {useActiveView} from "../hooks";
import InfoIcon from "@mui/icons-material/Info";

const SampleView: React.FC = () => {
    const {configureWidgets, ejectView} = useActiveView();

    useEffect(() => {
        configureWidgets([
            {component: <div style={{backgroundColor: "rgba(0,0,255,0.1)"}}>Sample add-on</div>, slot: 2},
            {component: <div style={{height: 200, backgroundColor: "rgba(255,0,255,0.1)"}}>Sample add-on 2</div>},
        ]);

        return () => ejectView()
    }, [configureWidgets, ejectView]);

    return (
        <Box sx={{/*width: "1200px", height: "1200px",*/
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Sheet variant="outlined" sx={{borderRadius: 'md', boxShadow: 'md', p: 3}}>
                <Typography level="h4" component="h1" color="success" startDecorator={<InfoIcon/>}>
                    This app is online
                </Typography>
            </Sheet>
        </Box>
    );
}

export default SampleView;
