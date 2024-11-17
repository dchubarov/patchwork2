import React, { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { useParams } from 'react-router-dom';
import Checklist from '../components/Checklist';
import { useActiveView, useApiClient } from '@/hooks';
import AllChecklistsWidget from '../components/AllChecklistsWidget';
import { useQuery } from '@tanstack/react-query';
import * as checklistApi from '../api';

const ChecklistsPage: React.FC = () => {
  const { configureWidgets } = useActiveView();
  const apiClient = useApiClient();
  const { checklistId } = useParams();

  const { data } = useQuery({
    queryKey: ['checklists/all'],
    queryFn: checklistApi.fetchAllChecklists(apiClient),
  });

  useEffect(() => {
    if (data) {
      configureWidgets({
        slot: 1,
        caption: 'All checklists',
        component: (
          <AllChecklistsWidget
            allChecklists={data.checklists}
            activeChecklistId={checklistId}
          />
        ),
      });
      return () => configureWidgets({ slot: 1, component: null });
    }
  }, [configureWidgets, checklistId, data]);

  return (
    <PageLayout.Content noTitle>
      <Checklist
        checklistId={checklistId === 'new' ? null : checklistId}
        showIds
      />
    </PageLayout.Content>
  );
};

export default ChecklistsPage;
