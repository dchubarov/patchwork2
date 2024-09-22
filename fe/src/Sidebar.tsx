import React from "react";
import {Sheet} from "@mui/joy";

const Sidebar: React.FC = () => {
    return (
        <Sheet variant="soft"
               sx={{
                   p: 2,
                   display: "flex",
                   flexDirection: "column",
                   borderRight: "1px solid",
                   borderColor: "divider"
               }}>
            Sidebar content
        </Sheet>
    );
}

export default Sidebar;
