import React, { useMemo } from 'react';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import Layout from './Layout';
import Sidebar from './Sidebar';
import ActiveViewProvider from '../providers/ActiveViewProvider';
import { customizeTheme } from '../lib/customizeTheme';
import ActiveViewBoundary from './ActiveViewBoundary';
import FacetProvider from '../providers/FacetProvider';

const App: React.FC = () => {
  const theme = useMemo(customizeTheme, []);

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />

      <FacetProvider>
        <ActiveViewProvider>
          <Layout.Root>
            {/*<Layout.Header>*/}
            {/* Placeholder for header component */}
            {/*</Layout.Header>*/}

            <Layout.Main>
              <Layout.Sidebar placement="left">
                <Sidebar />
              </Layout.Sidebar>

              <Layout.View>
                <ActiveViewBoundary />
              </Layout.View>

              <Layout.Sidebar placement="right">
                <Sidebar />
              </Layout.Sidebar>
            </Layout.Main>
          </Layout.Root>
          <Layout.Drawer />
          <Layout.Toaster />
        </ActiveViewProvider>
      </FacetProvider>
    </CssVarsProvider>
  );
};

export default App;
