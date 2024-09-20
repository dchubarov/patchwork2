import React from 'react';
import {Box, CssBaseline, CssVarsProvider, extendTheme, Sheet, Typography} from "@mui/joy";
import InfoIcon from "@mui/icons-material/Info";

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

            <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100dvh'}}>
                <Box sx={{height: '64px', borderBottom: '1px solid', borderColor: 'divider'}}>Header</Box>
                <Box sx={{flex: 1, display: 'flex'}}>
                    <Box sx={{
                        height: 'calc(100vh - 64px)',
                        width: '240px',
                        overflow: 'auto',
                        borderRight: '1px solid',
                        borderColor: 'divider'
                    }}>Sidebar</Box>
                    <Box sx={{
                        height: 'calc(100vh - 64px)',
                        overflow: 'auto',
                        flex: 1,
                        '& > *': {
                            minHeight: '100%'
                        }
                    }}>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                            <SampleContent/>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}

export default App;
