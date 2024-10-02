import React from "react";
import {Outlet} from "react-router-dom";
import {CssBaseline, CssVarsProvider, extendTheme} from "@mui/joy";
import Layout from "./components/Layout";
import Sidebar from "./components/Sidebar";
import ActiveViewProvider from "./providers/ActiveViewProvider";

const theme = extendTheme({})

const App: React.FC = () => {
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
                            <Outlet/>
                        </Layout.View>

                        <Layout.Sidebar placement="right">
                            <Sidebar/>
                        </Layout.Sidebar>
                    </Layout.Main>
                </Layout.Root>
            </ActiveViewProvider>
        </CssVarsProvider>
    );
}

export default App;
