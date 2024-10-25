import React, {Suspense, useMemo} from "react";
import {Outlet} from "react-router-dom";
import {CssBaseline, CssVarsProvider} from "@mui/joy";
import Layout from "./Layout";
import Sidebar from "./Sidebar";
import ActiveViewProvider from "../providers/ActiveViewProvider";
import {customizeTheme} from "@/application/utils/customizeTheme";

const App: React.FC = () => {
    const theme = useMemo(customizeTheme, []);
    return (
        <CssVarsProvider theme={theme}>
            <CssBaseline/>

            <ActiveViewProvider>
                <Layout.Root>
                    {/*<Layout.Header>*/}
                    {/* Placeholder for header component */}
                    {/*</Layout.Header>*/}

                    <Layout.Main>
                        <Layout.Sidebar placement="left">
                            <Sidebar/>
                        </Layout.Sidebar>

                        <Layout.View>
                            {/* TODO provide a clear fallback */}
                            <Suspense>
                                <Outlet/>
                            </Suspense>
                        </Layout.View>

                        <Layout.Sidebar placement="right">
                            <Sidebar/>
                        </Layout.Sidebar>
                    </Layout.Main>
                </Layout.Root>

                <Layout.Drawer/>
                <Layout.Toaster/>
            </ActiveViewProvider>
        </CssVarsProvider>
    );
}

export default App;
