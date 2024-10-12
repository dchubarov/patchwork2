import React, {useEffect, useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary,
    AspectRatio,
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Divider,
    DividerProps,
    Dropdown,
    IconButton,
    ListItem,
    ListItemContent,
    ListItemDecorator,
    ListSubheader,
    Menu,
    MenuButton,
    MenuItem,
    Sheet,
    SupportedColorScheme,
    Tooltip,
    Typography,
    useColorScheme
} from "@mui/joy";
import {
    Api as ApiIcon,
    CloudOff as OfflineIcon,
    DarkMode as DarkModeIcon,
    Home as HomeIcon,
    LightMode as LightModeIcon,
    LogoutSharp as LogoutIcon,
    MoreVert as SettingsIcon,
    Person4 as UserIcon,
    QuestionMark as PlaceholderIcon,
    ViewSidebarOutlined as SidebarIcon,
} from "@mui/icons-material";
import AppFeatures from "../features";
import {useNavigate} from "react-router-dom";
import {SidebarPlacement} from "../lib/viewStateTypes";
import ApiPlayground from "./ApiPlayground";
import {useEnvironment} from "../providers/EnvironmentProvider";
import {useActiveView} from "../providers/ActiveViewProvider";

const AppLogo: React.FC = () => {
    const {mode} = useColorScheme();
    const logoUrl = process.env.PUBLIC_URL + "/logo192" +
        ((mode === "light") ? "" : "-dark") + ".png";

    return (
        <AspectRatio ratio="1" variant="plain" sx={(/*theme*/) => ({
            minWidth: 32, // TODO compute from variables
            transition: "transform .3s ease-in-out",
            ":hover": {
                // /* TODO rotation causes visible clipping of logo corners */
                // /* TODO hover position at sides causes dribbling sometimes */
                transform: "rotate(-90deg)"
            }
        })}>
            <img src={logoUrl} alt="Logo"/>
        </AspectRatio>
    );
}

const SidebarDivider: React.FC<DividerProps> = ({sx, ...other}) => (
    <Divider {...other}
             color="primary"
             sx={[
                 {
                     backgroundColor: "var(--joy-palette-primary-300)",
                     background: "linear-gradient(90deg, " +
                         "var(--joy-palette-primary-softBg) 0%, " +
                         "var(--joy-palette-primary-softActiveBg) 25%, " +
                         "var(--joy-palette-primary-softActiveBg) 75%, " +
                         "var(--joy-palette-primary-softBg) 100%)"
                 },
                 ...(Array.isArray(sx) ? sx : [sx])
             ]}/>
);

const SettingsMenu: React.FC = () => {
    const {mode: colorScheme, setMode: setColorScheme} = useColorScheme();
    const {sidebarPlacement, configureView, openDrawer} = useActiveView();
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const {environment, versionInfo} = useEnvironment();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleColorSchemeButtonClick = (mode: SupportedColorScheme) => {
        if (mode !== colorScheme) {
            setColorScheme(mode);
        }
        setOpen(false);
    }

    const handleSidebarPlacementButtonClick = (placement: SidebarPlacement) => {
        if (placement !== sidebarPlacement) {
            configureView({sidebarPlacement: placement});
        }
        setOpen(false);
    }

    const handleOpenApiPlaygroundItemClick = () => {
        openDrawer(<ApiPlayground/>, "API playground");
    }

    return (
        <Dropdown
            open={open}
            onOpenChange={(_, isOpen) => setOpen(isOpen)}>

            <MenuButton
                slots={{root: IconButton}}
                slotProps={{root: {variant: "plain", size: "sm"}}}>
                <SettingsIcon/>
            </MenuButton>

            <Menu size="sm">
                <ListSubheader>Color scheme</ListSubheader>
                <ListItem>
                    {/*<ColorSchemeToggle size="sm"/>*/}
                    <ButtonGroup
                        disabled={!mounted}
                        size="sm"
                        buttonFlex={1}
                        sx={{width: "100%", resize: "horizontal"}}>
                        <Button
                            onClick={() => handleColorSchemeButtonClick("light")}
                            startDecorator={<LightModeIcon/>}
                            sx={{backgroundColor: colorScheme === "light" ? "background.level1" : "initial"}}>
                            Light
                        </Button>
                        <Button
                            onClick={() => handleColorSchemeButtonClick("dark")}
                            startDecorator={<DarkModeIcon/>}
                            sx={{backgroundColor: colorScheme === "dark" ? "background.level1" : "initial"}}>
                            Dark
                        </Button>
                    </ButtonGroup>
                </ListItem>

                <ListSubheader>Sidebar placement</ListSubheader>
                <ListItem>
                    <ButtonGroup
                        size="sm"
                        buttonFlex={1}
                        sx={{width: "100%", resize: "horizontal"}}>
                        <Button
                            onClick={() => handleSidebarPlacementButtonClick("left")}
                            startDecorator={<SidebarIcon sx={{transform: "rotate(180deg)"}}/>}
                            sx={{backgroundColor: sidebarPlacement === "left" ? "background.level1" : "initial"}}>
                            Left
                        </Button>
                        <Button
                            onClick={() => handleSidebarPlacementButtonClick("right")}
                            endDecorator={<SidebarIcon/>}
                            sx={{backgroundColor: sidebarPlacement === "right" ? "background.level1" : "initial"}}>
                            Right
                        </Button>
                    </ButtonGroup>
                </ListItem>

                {environment === "development" && <>
                    <ListSubheader>Developer tools</ListSubheader>
                    <MenuItem onClick={() => handleOpenApiPlaygroundItemClick()}>
                        <ListItemDecorator><ApiIcon/></ListItemDecorator>
                        Open API playground
                    </MenuItem>
                </>}

                {/* TODO read app version from environment, provide BE information */}
                <ListSubheader>About</ListSubheader>
                <MenuItem>{versionInfo}</MenuItem>
                <MenuItem color="danger">
                    <ListItemDecorator><OfflineIcon/></ListItemDecorator>
                    Backend offline
                </MenuItem>
            </Menu>
        </Dropdown>
    );
}

const Sidebar: React.FC = () => {
    const {widgets, sidebarPlacement, sectionTitle, sectionKey} = useActiveView();
    const pinnedWidget = (widgets.length > 0 && widgets[0].slot === 0) ? widgets[0] : null;
    const moreWidgets = (widgets.length > 0 && widgets.find((value) => value.component && value.slot !== 0))
    const navigate = useNavigate();

    return (
        <Box sx={{
            height: "100%",
            py: 2,
            pl: sidebarPlacement === "left" ? 2 : 0,
            pr: sidebarPlacement === "right" ? 2 : 0
        }}>
            {/* SIDEBAR ROOT CONTAINER */}
            <Sheet variant="soft"
                   color="primary"
                   invertedColors
                   sx={{
                       height: "100%",
                       overflowY: "auto",
                       overflowX: "clip",
                       display: "flex",
                       flexDirection: "column",
                       scrollbarWidth: "thin",
                       border: "1px solid",
                       borderColor: "var(--joy-palette-primary-softActiveBg)",
                       borderRadius: "sm",
                       boxShadow: "md",
                   }}>

                {/*APP HEADER & PINNED WIDGET WRAPPER*/}
                <Box
                    sx={{
                        px: 2,
                        pt: 2,
                        top: 0,
                        position: "sticky",
                        zIndex: 500,
                        backdropFilter: "blur(6px)"
                    }}>

                    {/*APP HEADER*/}
                    <Box sx={{display: "flex", flexWrap: "nowrap", alignItems: "center", gap: 1, overflow: "hidden"}}>
                        <Dropdown>
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
                                            <Avatar>
                                                <PlaceholderIcon/>
                                            </Avatar>
                                        </ListItemDecorator>
                                        {feature.displayName || feature.basename}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Dropdown>

                        <Typography noWrap level="title-lg" sx={{flexGrow: 1}}>
                            {sectionTitle || sectionKey || "!NoFeatTitle!"}
                        </Typography>

                        <SettingsMenu/>
                    </Box>

                    {/*PINNED WIDGET*/}
                    {pinnedWidget?.component && <Box sx={{mt: 3}}>
                        {pinnedWidget.component}
                    </Box>}

                    {moreWidgets && <SidebarDivider sx={{mt: 2}}/>}
                </Box>

                {/*MORE WIDGETS*/}
                <AccordionGroup disableDivider sx={{mt: 1}}>
                    {moreWidgets && widgets.filter((widget) => widget.slot !== 0).map((widget, index) => (
                        <Accordion key={`widget-${index}`} defaultExpanded>
                            <AccordionSummary>
                                <ListItemContent>
                                    <Typography level="title-sm">
                                        {widget.caption || widget.key}
                                    </Typography>
                                </ListItemContent>
                            </AccordionSummary>
                            <AccordionDetails>
                                {widget.component}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </AccordionGroup>

                {/*FOOTER WRAPPER*/}
                <Box sx={{
                    px: 2,
                    pb: 2,
                    position: "sticky",
                    bottom: 0,
                    zIndex: 501,
                    backdropFilter: "blur(6px)",
                }}>
                    <SidebarDivider sx={{mb: 2}}/>

                    {/*USER PANEL*/}
                    <Box sx={{
                        // p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}>
                        <Avatar size="sm">
                            <UserIcon/>
                        </Avatar>

                        <Box sx={{flexGrow: 1, minWidth: 0}}>
                            <Typography level="title-sm" noWrap>Very very long username, Very very long
                                username, </Typography>
                            <Typography level="body-xs" noWrap>user@example.com</Typography>
                        </Box>

                        <Tooltip title="Logout">
                            <IconButton size="sm" variant="outlined">
                                <LogoutIcon/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Sheet>
        </Box>
    );
}

export default Sidebar;
