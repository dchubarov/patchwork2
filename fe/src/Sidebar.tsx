import React from "react";
import {Box, Divider, Sheet, Typography} from "@mui/joy";
import version from "./version.json"
import {useViewParameters} from "./ViewContext";

const Sidebar: React.FC = () => {
    const {addons} = useViewParameters();

    return (
        <Sheet variant="plain"
               sx={{
                   display: "flex",
                   flexDirection: "column",
                   borderRight: "1px solid",
                   borderColor: "divider",
                   height: "100%",
                   overflow: "auto"
               }}>

            <Box sx={{flex: 1, p: 2, overflow: "auto"}}>
                {addons.map((addon, index) => (
                    <React.Fragment key={`addon-${index}`}>
                        {addon.component}
                    </React.Fragment>
                ))}
            </Box>

            <Divider/>
            <Typography level="body-sm" p={2}>v{version.version}</Typography>
        </Sheet>
    );
}

export default Sidebar;
