import React from 'react';
import ChecklistProvider, {
  ChecklistProviderProps,
} from '../providers/ChecklistProvider';
import ChecklistContent, { ChecklistContentProps } from './ChecklistContent';

type ChecklistProps = ChecklistProviderProps & ChecklistContentProps;

const Checklist: React.FC<ChecklistProps> = ({ checklistId, ...props }) => {
  return (
    <ChecklistProvider checklistId={checklistId}>
      <ChecklistContent {...props} />
    </ChecklistProvider>
  );
};

export default Checklist;
