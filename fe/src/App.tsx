import React from "react";
import {Outlet} from "react-router-dom";
import {CssBaseline, CssVarsProvider, extendTheme} from "@mui/joy";
import Layout from "./Layout";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ViewParametersProvider from "./ViewContext";

const theme = extendTheme({})

const App: React.FC = () => {
    return (
        <CssVarsProvider theme={theme}>
            <CssBaseline/>

            <ViewParametersProvider>
                <Layout.Root>
                    <Layout.Header>
                        <Header/>
                    </Layout.Header>

                    <Layout.Main>
                        <Layout.Sidebar>
                            <Sidebar/>
                        </Layout.Sidebar>

                        <Layout.View>
                            <Outlet/>
                        </Layout.View>
                    </Layout.Main>
                </Layout.Root>
            </ViewParametersProvider>
        </CssVarsProvider>
    );
}

export default App;
