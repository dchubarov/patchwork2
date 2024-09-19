import React from 'react';
import {Box, CssBaseline, CssVarsProvider, extendTheme, Sheet, Typography} from "@mui/joy";
import InfoIcon from "@mui/icons-material/Info"

const theme = extendTheme({})

function App() {
    return (
        <CssVarsProvider theme={theme}>
            <CssBaseline/>
            <Box className="App" sx={{display: 'flex', minHeight: '100dvh'}}>
                <Box className="View"
                     component="main"
                     sx={{
                         flex: 1,
                         display: 'flex',
                         flexDirection: 'column',
                         minWidth: 0,
                         height: '100dvh',
                         gap: 1,
                         overflow: 'auto',
                         justifyContent: 'center',
                         alignItems: 'center'
                     }}>

                    <Sheet variant="outlined" sx={{borderRadius: 'md', boxShadow: 'md', p: 3}}>
                        <Typography level="h4" component="h1" color="success" startDecorator={<InfoIcon/>}>
                            This app is online
                        </Typography>
                    </Sheet>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}

export default App;
