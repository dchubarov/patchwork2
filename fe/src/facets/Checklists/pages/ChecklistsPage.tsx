import React, { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { useParams } from 'react-router-dom';
import Checklist from '../components/Checklist';
import { useActiveView } from '@/hooks';
import AllChecklistsWidget from '../components/AllChecklistsWidget';

const ChecklistsPage: React.FC = () => {
  const { configureWidgets, ejectView } = useActiveView();
  const { checklistId } = useParams();

  useEffect(() => {
    configureWidgets({
      slot: 1,
      caption: 'All checklists',
      component: <AllChecklistsWidget activeChecklistId={checklistId} />,
    });
    return () => ejectView();
  }, [configureWidgets, ejectView, checklistId]);

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
