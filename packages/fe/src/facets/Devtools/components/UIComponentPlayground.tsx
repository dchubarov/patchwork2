import React, { useState } from 'react';
import { IndexedLayoutChildProps } from '@/types/layout';
import { Stack } from '@mui/joy';
import UIComponentCard from './UIComponentCard';
import UILibrary from './UIComponentLibrary';

const UIComponentPlayground: React.FC<IndexedLayoutChildProps> = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  return (
    <Stack gap={2}>
      {Object.entries(UILibrary).map(([key, props]) => (
        <UIComponentCard
          {...props}
          key={key}
          title={props.title ?? key}
          expanded={expandedCard === key}
          onExpandedChange={(expanded) =>
            expanded ? setExpandedCard(key) : setExpandedCard(null)
          }
        />
      ))}
    </Stack>
  );
};

export default UIComponentPlayground;
