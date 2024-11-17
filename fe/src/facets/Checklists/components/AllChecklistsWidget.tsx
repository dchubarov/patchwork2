import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AspectRatio,
  Chip,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemDecorator,
  Tooltip,
  Typography,
} from '@mui/joy';
import { Add as AddIcon, ArrowRight as ActiveIcon } from '@mui/icons-material';
import { useActiveView } from '@/hooks';
import PieProgress from '@/components/PieProgress';
import { ChecklistBaseData } from '../types/schema';

const AllChecklistsGroup: React.FC<{
  count?: number;
  caption: string;
  addButton?: boolean;
}> = ({ count, caption, addButton }) => {
  const navigate = useNavigate();
  const { facet } = useActiveView();
  return (
    <ListItem
      component="div"
      endAction={
        addButton && (
          <IconButton
            onClick={() => navigate(`${facet?.basePath}/new`)}
            variant="plain"
            size="sm"
            sx={{
              width: 'var(--ListItem-minHeight)',
              height: 'var(--ListItem-minHeight)',
            }}>
            <AddIcon fontSize="md" />
          </IconButton>
        )
      }
      sx={(theme) => ({
        typography: theme.typography['body-xs'],
        textTransform: 'uppercase',
      })}>
      {caption}
      <Chip size="sm">{count || 0}</Chip>
    </ListItem>
  );
};

const AllChecklistsItem: React.FC<{
  item: ChecklistBaseData;
  active?: boolean;
}> = ({ item, active }) => {
  const { facet } = useActiveView();
  if (!item.id) return null;

  let progress = 0,
    progressTooltip = '0 / 0';

  if (
    item.progress &&
    item.progress.doableCount > 0 &&
    item.progress.doneCount > 0
  ) {
    progressTooltip = `${item.progress.doneCount} / ${item.progress.doableCount}`;
    progress = Math.trunc(
      (item.progress.doneCount / item.progress.doableCount) * 100
    );
  }

  return (
    <ListItem startAction={active && <ActiveIcon fontSize="sm" />}>
      <ListItemDecorator>
        <Tooltip title={progressTooltip} arrow>
          <AspectRatio
            ratio={1}
            variant="soft"
            sx={{
              '--AspectRatio-radius': '50%',
              width: 24,
            }}>
            <PieProgress
              value={progress}
              margin={3}
              thickness={9}
              zeroIndicator
            />
          </AspectRatio>
        </Tooltip>
      </ListItemDecorator>
      <Typography level="body-sm" noWrap>
        <Link component={RouterLink} to={`${facet?.basePath}/${item.id}`}>
          {item.title}
        </Link>
      </Typography>
    </ListItem>
  );
};

const AllChecklistsWidget: React.FC<{
  allChecklists: ChecklistBaseData[];
  activeChecklistId?: string | null;
}> = ({ allChecklists, activeChecklistId }) => {
  return (
    <List
      size="sm"
      sx={{
        '--List-gap': '0.125rem',
        '--ListItem-minHeight': '24px',
        '--ListItem-startActionWidth': 0,
        '--ListItem-startActionTranslateX': '-50%',
      }}>
      <ListItem nested>
        <AllChecklistsGroup
          count={allChecklists.length}
          caption="Personal checklists"
          addButton
        />
        {allChecklists.length && (
          <List>
            {allChecklists.map((item) => (
              <AllChecklistsItem
                key={item.id}
                item={item}
                active={item.id === activeChecklistId}
              />
            ))}
          </List>
        )}
      </ListItem>
      {/*<ListItem nested>*/}
      {/*  <AllChecklistsGroup caption="Shared with me" count={0} />*/}
      {/*</ListItem>*/}
    </List>
  );
};

export default AllChecklistsWidget;
