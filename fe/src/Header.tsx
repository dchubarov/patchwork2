import React from "react";
import {IconButton, Sheet, Tooltip, Typography} from "@mui/joy";
import BugIcon from "@mui/icons-material/BugReport";

const Header: React.FC = () => {
    return (
        <Sheet variant="soft"
               sx={{
                   px: 2,
                   py: "auto",
                   display: "flex",
                   alignItems: "center",
                   height: "var(--Header-height)",
                   borderBottom: "1px solid",
                   borderColor: "divider",
                   boxShadow: "sm"
               }}>

            <Typography sx={{flex: 1}}>
                AppLogo
            </Typography>

            <Tooltip title="Debug">
                <IconButton color="danger">
                    <BugIcon/>
                </IconButton>
            </Tooltip>
        </Sheet>
    );
}

export default Header;
