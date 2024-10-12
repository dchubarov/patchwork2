import React, {Suspense} from "react";
import {Outlet} from "react-router-dom";
import {CssBaseline, CssVarsProvider} from "@mui/joy";
import Layout from "./components/Layout";
import Sidebar from "./components/Sidebar";
import ActiveViewProvider from "./providers/ActiveViewProvider";
import appTheme from "./lib/theme";

const App: React.FC = () => {
    return (
        <CssVarsProvider theme={appTheme}>
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
            </ActiveViewProvider>
        </CssVarsProvider>
    );
}

export default App;
