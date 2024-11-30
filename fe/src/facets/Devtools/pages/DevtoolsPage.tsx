import React from 'react';
import PageLayout, { IndexedLayoutTab } from '@/components/PageLayout';
import ViewContextPlayground from '../components/ViewContextPlayground';
import UIComponentPlayground from '../components/UIComponentPlayground';
import { useActiveView, useFacet } from '@/hooks';

const DevtoolsPage: React.FC = () => {
  const { configureView } = useActiveView();
  const facet = useFacet();

  const handlePageChange = (tab: IndexedLayoutTab) => {
    configureView({ title: tab.caption, scope: facet.basePath });
  };

  return (
    <PageLayout.Indexed onTabChange={handlePageChange}>
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
