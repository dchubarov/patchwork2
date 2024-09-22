import React from "react";
import {Box, CssBaseline, CssVarsProvider, extendTheme, Sheet, Typography} from "@mui/joy";
import InfoIcon from "@mui/icons-material/Info";
import Layout from "./Layout";
import Header from "./Header";
import Sidebar from "./Sidebar";

const theme = extendTheme({})

const SampleContent: React.FC = () => (
    <Sheet variant="outlined" sx={{borderRadius: 'md', boxShadow: 'md', p: 3}}>
        <Typography level="h4" component="h1" color="success" startDecorator={<InfoIcon/>}>
            This app is online
        </Typography>
    </Sheet>
);

const App: React.FC = () => {
    return (
        <CssVarsProvider theme={theme}>
            <CssBaseline/>

            <Layout.Root>
                <Layout.Header>
                    <Header/>
                </Layout.Header>

                <Layout.Main>
                    <Layout.Sidebar>
                        <Sidebar/>
                    </Layout.Sidebar>

                    <Layout.View>
                        <Box sx={{
                            display: 'flex', /*height: '1200px', width: '1200px',*/
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }}>
                            <SampleContent/>
                        </Box>
                    </Layout.View>
                </Layout.Main>
            </Layout.Root>
        </CssVarsProvider>
    );
}

export default App;
