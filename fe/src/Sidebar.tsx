import React from "react";
import {Divider, Sheet, Typography} from "@mui/joy";

const Sidebar: React.FC = () => {
    return (
        <Sheet variant="plain"
               sx={{
                   display: "flex",
                   flexDirection: "column",
                   borderRight: "1px solid",
                   borderColor: "divider"
               }}>

            <Typography sx={{flex: 1, p: 2}}>
                Sidebar content
            </Typography>

            <Divider/>
            <Typography level="body-sm" p={2}>Version 1.2.3</Typography>
            {/*TODO display actual version*/}
        </Sheet>
    );
}

export default Sidebar;
