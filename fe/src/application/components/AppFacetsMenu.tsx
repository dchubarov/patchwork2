import React from "react";
import {useNavigate} from "react-router-dom";
import {Avatar, Badge, Dropdown, IconButton, ListItemDecorator, Menu, MenuButton, MenuItem} from "@mui/joy";
import {Home as HomeIcon, Lock as LockIcon} from "@mui/icons-material";
import AppLogo from "./AppLogo";
import {useActiveView, useEnvironment} from "@/hooks";

const AppFacetsMenu: React.FC = () => {
    const {availableFacets} = useEnvironment();
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
                        <Avatar sx={{borderRadius: "sm"}}>
                            <HomeIcon/>
                        </Avatar>
                    </ListItemDecorator>
                    Home
                </MenuItem>

                {availableFacets.map((facet) => (
                    <MenuItem key={`appMenuItem-${facet.name}`} orientation="vertical"
                              onClick={() => navigate(facet.basePath)}>
                        <ListItemDecorator>
                            <Badge
                                size="sm"
                                variant="soft"
                                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                                badgeInset="20%"
                                badgeContent={<LockIcon sx={{"--Icon-fontSize": "14px"}}/>}
                                slotProps={{badge: {sx: {backgroundColor: "transparent"}}}}
                                sx={{"--Badge-ringSize": 0, backgroundColor: "transparent"}}>
                                <Avatar sx={{borderRadius: "sm"}}>
                                    {facet.icon
                                        ? typeof facet.icon === "string" ? facet.icon : <facet.icon/>
                                        : facet.localizedDisplayName.substring(0, 1)}
                                </Avatar>
                            </Badge>
                        </ListItemDecorator>
                        {facet.localizedDisplayName}
                    </MenuItem>
                ))}
            </Menu>
        </Dropdown>
    );
}

export default AppFacetsMenu;
