import React from "react";
import {Box, Sheet, Typography} from "@mui/joy";
import InfoIcon from "@mui/icons-material/Info";

const SampleView: React.FC = () => (
    <Box sx={{/*width: "1200px", height: "1200px",*/ display: "flex", alignItems: "center", justifyContent: "center"}}>
        <Sheet variant="outlined" sx={{borderRadius: 'md', boxShadow: 'md', p: 3}}>
            <Typography level="h4" component="h1" color="success" startDecorator={<InfoIcon/>}>
                This app is online
            </Typography>
        </Sheet>
    </Box>
);

export default SampleView;
