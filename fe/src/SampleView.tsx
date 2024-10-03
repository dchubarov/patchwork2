import React, {useEffect, useState} from "react";
import {IconButton, Sheet, Typography} from "@mui/joy";
import {useActiveView} from "./lib/useActiveView";
import InfoIcon from "@mui/icons-material/Info";
import PageLayout from "./components/PageLayout";
import axios from "axios";
import "axios-retry";
import {Refresh as RefreshIcon} from "@mui/icons-material";

const SampleView: React.FC = () => {
    const {configureWidgets, ejectView} = useActiveView();
    const [serverInfo, setServerInfo] = useState<any | null>(null);

    const refreshBackendInfo = () => {
        axios.get(process.env.REACT_APP_API_ROOT + "/info", {"axios-retry": {retries: 3}})
            .then((response) => setServerInfo(response.data))
            .catch(() => setServerInfo(null));
    }

    useEffect(() => {
        refreshBackendInfo();
        configureWidgets([
            {component: <div style={{backgroundColor: "rgba(0,0,255,0.1)"}}>Sample add-on</div>, slot: 2},
            {component: <div style={{height: 200, backgroundColor: "rgba(255,0,255,0.1)"}}>Sample add-on 2</div>},
        ]);
        return () => ejectView()
    }, [configureWidgets, ejectView]);

    return (
        <PageLayout.Centered>
            <Sheet variant="outlined" sx={{borderRadius: 'md', boxShadow: 'md', display: "flex", p: 3}}>
                <Typography level="h4" component="h1" color="success" startDecorator={<InfoIcon/>}>
                    {serverInfo
                        ? serverInfo.server + " (" + serverInfo.timestamp + ")"
                        : "Backend is not available"}
                </Typography>
                <IconButton onClick={refreshBackendInfo}>
                    <RefreshIcon/>
                </IconButton>
            </Sheet>
        </PageLayout.Centered>
    );
}

export default SampleView;
