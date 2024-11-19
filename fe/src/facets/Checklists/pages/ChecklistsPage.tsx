import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useActiveView } from '@/hooks';
import PageLayout from '@/components/PageLayout';
import { useAllChecklistsQuery } from '../lib/queries';
import AllChecklistsWidget from '../components/AllChecklistsWidget';
import ChecklistProvider from '../providers/ChecklistProvider';
import ChecklistContent from '../components/ChecklistContent';
import ChecklistSkeleton from '../components/ChecklistSkeleton';

const ChecklistsPage: React.FC = () => {
  const navigate = useNavigate();
  const { configureWidgets, facet } = useActiveView();
  const { checklistId } = useParams();
  const { data } = useAllChecklistsQuery();

  const navigateToChecklist = useCallback(
    (toChecklistId: string | null) => {
      navigate(`${facet?.basePath}/${toChecklistId ?? 'new'}`);
    },
    [facet, navigate]
  );

  useEffect(() => {
    configureWidgets({
      slot: 1,
      caption: 'All checklists',
      component: <AllChecklistsWidget activeChecklistId={checklistId} />,
    });
    return () => configureWidgets({ slot: 1, component: null });
  }, [checklistId, configureWidgets]);

  useEffect(() => {
    if (data && checklistId == null) {
      // TODO navigate to last used checklist
      if (data.checklists.length < 1) navigateToChecklist(null);
      else navigateToChecklist(data.checklists[0].id!!);
    }
  }, [checklistId, data, navigateToChecklist]);

  return (
    <PageLayout.Content noTitle>
      {checklistId == null ? (
        <ChecklistSkeleton />
      ) : (
        <ChecklistProvider
          checklistId={checklistId !== 'new' ? checklistId : null}
          loadingElement={<ChecklistSkeleton />}
          onMaterialize={navigateToChecklist}>
          <ChecklistContent showIds />
        </ChecklistProvider>
      )}
    </PageLayout.Content>
  );
};

export default ChecklistsPage;
