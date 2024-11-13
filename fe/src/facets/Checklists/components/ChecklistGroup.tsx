import React from 'react';
import ChecklistItem from './ChecklistItem';
import { useChecklist } from '../hooks';

interface ChecklistGroupProps {
  level: number;
  rootId?: string | null;
  showIds?: boolean;
}

const ChecklistGroup: React.FC<ChecklistGroupProps> = ({
  level,
  rootId = null,
  showIds = false,
}) => {
  const { groups } = useChecklist();
  const items = groups.get(rootId)?.items || [];

  return (
    <>
      {items.map((item) => (
        <ChecklistItem
          key={item.id}
          level={level}
          item={item}
          showIds={showIds}
        />
      ))}
    </>
  );
};

export default ChecklistGroup;
