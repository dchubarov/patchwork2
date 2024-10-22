import React, {useEffect} from "react";
import {Sheet, Typography} from "@mui/joy";
import InfoIcon from "@mui/icons-material/Info";
import PageLayout from "./components/PageLayout";
import {useActiveView} from "./providers/ActiveViewProvider";

const SampleView: React.FC = () => {
    const {configureWidgets, ejectView} = useActiveView();

    useEffect(() => {
        configureWidgets([
            {component: <div style={{backgroundColor: "rgba(0,0,255,0.1)"}}>Sample add-on</div>, slot: 2},
            {component: <div style={{height: 200, backgroundColor: "rgba(255,0,255,0.1)"}}>Sample add-on 2</div>},
        ]);

        return () => {
            ejectView();
        }
    }, [configureWidgets, ejectView]);

    return (
        <PageLayout.Centered>
            <Sheet variant="outlined" sx={{borderRadius: 'md', boxShadow: 'md', display: "flex", p: 3}}>
                <Typography level="h4" component="h1" color="success" startDecorator={<InfoIcon/>}>
                    This app is online.
                </Typography>
            </Sheet>
        </PageLayout.Centered>
    );
}

export default SampleView;
