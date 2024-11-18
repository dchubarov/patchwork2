import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useActiveView, useApiClient } from '@/hooks';
import PageLayout from '@/components/PageLayout';
import AllChecklistsWidget from '../components/AllChecklistsWidget';
import * as checklistApi from '../api';
import ChecklistProvider from '../providers/ChecklistProvider';
import ChecklistContent from '../components/ChecklistContent';

const ChecklistsPage: React.FC = () => {
  const { configureWidgets, facet } = useActiveView();
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const { checklistId } = useParams();

  const { data } = useQuery({
    queryKey: ['checklists/all'],
    queryFn: checklistApi.fetchAllChecklists(apiClient),
  });

  const navigateToChecklist = useCallback(
    (toChecklistId: string | null) => {
      navigate(`${facet?.basePath}/${toChecklistId ?? 'new'}`);
    },
    [facet, navigate]
  );

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
        if (data.checklists.length < 1) navigateToChecklist(null);
        else navigateToChecklist(data.checklists[0].id!!);
      }

      return () => configureWidgets({ slot: 1, component: null });
    }
  }, [configureWidgets, navigateToChecklist, checklistId, data]);

  // TODO actual loading state
  if (checklistId == null) return 'Thinking...';

  return (
    <PageLayout.Content noTitle>
      <ChecklistProvider
        checklistId={checklistId !== 'new' ? checklistId : null}
        onMaterialize={navigateToChecklist}>
        <ChecklistContent showIds />
      </ChecklistProvider>
    </PageLayout.Content>
  );
};

export default ChecklistsPage;
