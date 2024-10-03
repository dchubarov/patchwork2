import React, {
    Children,
    cloneElement,
    isValidElement,
    PropsWithChildren,
    ReactElement,
    useEffect,
    useMemo,
    useState
} from "react";
import {Box, BoxProps, Tab, TabList, TabPanel, Tabs, Typography} from "@mui/joy";
import {useActiveView} from "../lib/useActiveView";
import {SidebarPlacement} from "../lib/viewStateTypes";
import {IndexedLayoutChildProps} from "../lib/pageLayoutTypes";

const paddingSxProps = (sidebarPlacement: SidebarPlacement) => ({
    pl: sidebarPlacement === "left" ? 4 : 2,
    pr: sidebarPlacement === "right" ? 4 : 2,
    py: 2
});

const PageTitle: React.FC<BoxProps> = ({sx, ...other}) => {
    const {title, key} = useActiveView();

    return (
        <Box {...other} sx={[{mb: 2}, ...Array.isArray(sx) ? sx : [sx]]}>
            {/* TODO show breadcrumbs if available*/}
            <Typography component="h1" level="h2">{title || key || "!NoViewTitle!"}</Typography>
        </Box>
    );
}

const Content: React.FC<PropsWithChildren> = ({children}) => {
    const {sidebarPlacement} = useActiveView();

    return (
        <Box sx={{...paddingSxProps(sidebarPlacement)}}>
            <PageTitle/>
            {children}
        </Box>
    );
}

const Centered: React.FC<PropsWithChildren> = ({children}) => {
    const {sidebarPlacement} = useActiveView();

    return (
        <Box sx={{
            ...paddingSxProps(sidebarPlacement),
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            {children}
        </Box>
    );
}

// EXPERIMENTAL: displays children in tabs
interface TabState {
    key: string,
    caption: string,
    element: ReactElement
}

const Indexed: React.FC<PropsWithChildren> = ({children}) => {
    const {sidebarPlacement, configureView} = useActiveView();
    const tabs = useMemo(() => Children
        .map(children, (child) => {
            if (!isValidElement<IndexedLayoutChildProps>(child)) {
                return null;
            }
            return {
                key: child.props.tabKey,
                caption: child.props.tabCaption,
                element: child
            } as TabState;
        })
        ?.filter((item) => item !== null), [children]);

    const [activeTab, setActiveTab] = useState<TabState | null>(tabs?.[0] || null);
    useEffect(() => {
        configureView({title: activeTab?.caption})
    }, [activeTab, configureView]);

    const handleTabChange = (tabKey?: string | number | null) => {
        const tab = tabs?.find((value) => value.key === tabKey);
        setActiveTab(tab || null);
    }

    return (
        <Tabs value={activeTab?.key}
              onChange={(_, value) => handleTabChange(value)}
              variant="plain"
              orientation="vertical"
              sx={{height: "100%", flexDirection: sidebarPlacement === "left" ? "row-reverse" : "row"}}>

            <TabList underlinePlacement={sidebarPlacement} sx={{py: 2}}>
                {tabs?.map((tab, index) => (
                    <Tab key={`tab-${index}`} value={tab.key} indicatorPlacement={sidebarPlacement}>
                        {tab.caption || tab.key}
                    </Tab>
                ))}
            </TabList>

            {tabs?.map((tab, index) => (
                <TabPanel key={`panel-${index}`}
                          value={tab.key}
                          sx={{
                              ...paddingSxProps(sidebarPlacement),
                              pl: 4,
                              overflow: "auto",
                              backgroundColor: "background.body"
                          }}>
                    <PageTitle/>
                    {cloneElement(tab.element)}
                </TabPanel>
            ))}
        </Tabs>
    );
}

const defaultExports = {
    Centered,
    Content,
    Indexed,
}

export default defaultExports;
