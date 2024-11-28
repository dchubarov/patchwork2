import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { useAllChecklistsQuery } from '../lib/queries';
import SuspenseFallback from '@/components/SuspenseFallback';
import AllChecklistsWidget from '../components/AllChecklistsWidget';
import ChecklistProvider from '../providers/ChecklistProvider';
import ChecklistContent from '../components/ChecklistContent';
import { useFacet, useSidebarWidgets } from '@/hooks/view';

const ChecklistsPage: React.FC = () => {
  const navigate = useNavigate();
  const { configureWidgets, removeWidgets } = useSidebarWidgets();
  const facet = useFacet();
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
      scope: `!${facet?.basePath}/*`,
      component: <AllChecklistsWidget activeChecklistId={checklistId} />,
    });
    return () => removeWidgets(1);
  }, [checklistId, configureWidgets, facet?.basePath]);

  useEffect(() => {
    if (data && checklistId == null) {
      // TODO navigate to last used checklist
      if (data.checklists.length < 1) navigateToChecklist(null);
      else navigateToChecklist(data.checklists[0].id!!);
    }
  }, [checklistId, data, navigateToChecklist]);

  return checklistId == null ? (
    <SuspenseFallback />
  ) : (
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
