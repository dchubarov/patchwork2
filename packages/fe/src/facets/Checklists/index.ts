import { ApplicationFacet } from '@/types/facet';
import React from 'react';
import ChecklistIcon from './assets/checklist.svg';

const LazyChecklistsPage = React.lazy(() => import('./pages/ChecklistsPage'));

const ChecklistsFacet: ApplicationFacet = {
  name: 'checklists',
  authorization: true,
  icon: ChecklistIcon,
  routes: () => [
    {
      index: true,
      Component: LazyChecklistsPage,
    },
    {
      path: ':checklistId',
      Component: LazyChecklistsPage,
    },
  ],
};

export default ChecklistsFacet;
