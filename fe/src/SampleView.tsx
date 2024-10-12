import React, {useEffect} from "react";
import {IconButton, Sheet, Typography} from "@mui/joy";
import InfoIcon from "@mui/icons-material/Info";
import PageLayout from "./components/PageLayout";
import "axios-retry";
import {Refresh as RefreshIcon} from "@mui/icons-material";
import useCall from "./lib/useCall";
import {useActiveView} from "./providers/ActiveViewProvider";

const SampleView: React.FC = () => {
    const {status, data: serverInfo, execute: refreshServerInfo} = useCall({path: "server-info"}, false);
    const {configureWidgets, ejectView} = useActiveView();

    useEffect(() => {
        const interval = setInterval(() => refreshServerInfo(), 5000);

        configureWidgets([
            {component: <div style={{backgroundColor: "rgba(0,0,255,0.1)"}}>Sample add-on</div>, slot: 2},
            {component: <div style={{height: 200, backgroundColor: "rgba(255,0,255,0.1)"}}>Sample add-on 2</div>},
        ]);

        return () => {
            clearInterval(interval);
            ejectView();
        }
    }, [configureWidgets, ejectView, refreshServerInfo]);

    return (
        <PageLayout.Centered>
            <Sheet variant="outlined" sx={{borderRadius: 'md', boxShadow: 'md', display: "flex", p: 3}}>
                <Typography level="h4" component="h1" color="success" startDecorator={<InfoIcon/>}>
                    {serverInfo
                        ? serverInfo.server + " (" + serverInfo.timestamp + ")"
                        : "Backend is not available"}
                </Typography>
                <IconButton loading={status === "loading"} onClick={() => refreshServerInfo()}>
                    <RefreshIcon/>
                </IconButton>
            </Sheet>
        </PageLayout.Centered>
    );
}

export default SampleView;
