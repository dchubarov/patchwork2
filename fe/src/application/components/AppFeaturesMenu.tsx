import React from "react";
import {Avatar, Badge, Dropdown, IconButton, ListItemDecorator, Menu, MenuButton, MenuItem} from "@mui/joy";
import AppLogo from "./AppLogo";
import {Home as HomeIcon, Lock as LockIcon, QuestionMark as PlaceholderIcon} from "@mui/icons-material";
import AppFeatures from "../../features";
import {useNavigate} from "react-router-dom";
import {useActiveView} from "../../hooks";

const AppFeaturesMenu: React.FC = () => {
    const {sidebarPlacement} = useActiveView();
    const navigate = useNavigate();

    return (
        <Dropdown>
            {/*PILLOW BUTTON*/}
            <MenuButton
                slots={{root: IconButton}}
                slotProps={{root: {variant: "plain"}}}>
                <AppLogo/>
            </MenuButton>
            <Menu placement={sidebarPlacement === "left" ? "bottom-start" : "bottom-end"}
                  variant="solid"
                  color="neutral"
                  size="sm"
                  invertedColors
                  sx={{
                      "--List-padding": "0.5rem",
                      "--ListItemDecorator-size": "3rem",
                      "--ListItem-radius": "var(--joy-radius-sm)",
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 100px)",
                      gridAutoRows: "100px",
                  }}>
                <MenuItem orientation="vertical" onClick={() => navigate("/")}>
                    <ListItemDecorator>
                        <Avatar>
                            <HomeIcon/>
                        </Avatar>
                    </ListItemDecorator>
                    Home
                </MenuItem>

                {AppFeatures.map((feature, index) => (
                    <MenuItem key={`appMenuItem-${index}`} orientation="vertical"
                              onClick={() => navigate(feature.basename)}>
                        <ListItemDecorator>
                            <Badge
                                size="sm"
                                variant="soft"
                                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                                badgeInset="20%"
                                badgeContent={<LockIcon/>}
                                slotProps={{badge: {sx: {backgroundColor: "transparent"}}}}
                                sx={{"--Badge-ringSize": 0, backgroundColor: "transparent"}}>
                                <Avatar>
                                    <PlaceholderIcon/>
                                </Avatar>
                            </Badge>
                        </ListItemDecorator>
                        {feature.displayName || feature.basename}
                    </MenuItem>
                ))}
            </Menu>
        </Dropdown>
    );
}

export default AppFeaturesMenu;
