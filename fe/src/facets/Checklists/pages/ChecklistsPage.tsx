import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Checklist from '../components/Checklist';
import { useActiveView, useApiClient } from '@/hooks';
import PageLayout from '@/components/PageLayout';
import AllChecklistsWidget from '../components/AllChecklistsWidget';
import * as checklistApi from '../api';

const ChecklistsPage: React.FC = () => {
  const { configureWidgets, facet } = useActiveView();
  const navigate = useNavigate();
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

      if (checklistId == null) {
        // TODO navigate to last used checklist
        if (data.checklists.length < 1) navigate(`${facet?.basePath}/new`);
        else navigate(`${facet?.basePath}/${data.checklists[0].id}`);
      }

      return () => configureWidgets({ slot: 1, component: null });
    }
  }, [configureWidgets, checklistId, data, facet, navigate]);

  // TODO actual loading state
  if (checklistId == null) return 'Loading...';

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
