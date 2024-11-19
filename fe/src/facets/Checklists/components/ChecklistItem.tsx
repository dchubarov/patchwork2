import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import {
  IconButton,
  IconButtonProps,
  List,
  ListItem,
  listItemClasses,
} from '@mui/joy';
import { KeyboardArrowDown as ExpandedIcon } from '@mui/icons-material';
import { ChecklistItemData } from '../lib/schema';
import ChecklistGroup from './ChecklistGroup';
import ChecklistItemContent from './ChecklistItemContent';

import { useChecklist } from '../lib/context';

interface ChecklistItemProps {
  level: number;
  item: ChecklistItemData;
  showIds?: boolean;
}

const ChecklistGroupExpandButton: React.FC<
  IconButtonProps & { expanded: boolean }
> = ({ expanded, ...other }) => {
  return (
    <IconButton
      {...other}
      size="sm"
      variant="plain"
      sx={{
        borderRadius: '50%',
        transform: expanded ? undefined : 'rotate(-90deg)',
      }}>
      <ExpandedIcon />
    </IconButton>
  );
};

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  level,
  item,
  showIds,
}) => {
  const { groups, setGroupExpanded } = useChecklist();
  const group = groups.get(item.id);
  const nestedListRef = useRef(null);

  const contentElement = (
    <ChecklistItemContent
      level={level}
      item={item}
      group={group}
      showId={showIds}
    />
  );

  const selfSxProps = {
    '& .item-secondary-control': {
      visibility: 'hidden',
    },
    '&:hover .item-secondary-control': {
      visibility: 'visible',
    },
  };

  return (
    <ListItem nested={!!group} sx={!!group ? undefined : selfSxProps}>
      {!group ? (
        contentElement
      ) : (
        <>
          <ListItem
            component="div"
            startAction={
              <ChecklistGroupExpandButton
                expanded={group.expanded}
                onClick={() => setGroupExpanded(item.id, !group.expanded)}
              />
            }
            sx={{
              '--ListItem-startActionTranslateX': `calc((${level - 1} * var(--List-nestedInsetStart, 1.25rem)) - 30%)`,
              ...selfSxProps,
            }}>
            {contentElement}
          </ListItem>

          <CSSTransition
            nodeRef={nestedListRef}
            classNames={listItemClasses.nesting}
            in={group.expanded}
            timeout={80}
            unmountOnExit>
            <List ref={nestedListRef}>
              <ChecklistGroup
                level={level + 1}
                rootId={item.id}
                showIds={showIds}
              />
            </List>
          </CSSTransition>
        </>
      )}
    </ListItem>
  );
};

export default ChecklistItem;
