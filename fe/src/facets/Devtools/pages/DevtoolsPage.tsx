import React from 'react';
import PageLayout from '@/components/PageLayout';
import ViewContextPlayground from '../components/ViewContextPlayground';
import UIComponentPlayground from '../components/UIComponentPlayground';

const DevtoolsPage: React.FC = () => {
  /*useEffect(() => {
    return () => ejectView();
  }, [ejectView]);*/

  return (
    <PageLayout.Indexed>
      <UIComponentPlayground
        tabKey="ui-libarary"
        tabCaption="Component Library"
      />

      <ViewContextPlayground
        tabKey="view-context-playground"
        tabCaption="View Context"
      />
    </PageLayout.Indexed>
  );
};

export default DevtoolsPage;
