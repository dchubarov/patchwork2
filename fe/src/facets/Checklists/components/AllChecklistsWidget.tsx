import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AspectRatio,
  Chip,
  CircularProgress,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemDecorator,
  Tooltip,
  Typography,
} from '@mui/joy';
import { Add as AddIcon, ArrowRight as ActiveIcon } from '@mui/icons-material';
import PieProgress from '@/components/PieProgress';
import { ChecklistBaseData } from '../lib/schema';
import { useAllChecklistsQuery } from '../lib/queries';
import { useFacetOrNull } from '@/hooks/view';

const AllChecklistsGroup: React.FC<{
  count?: number;
  caption: string;
  addButton?: boolean;
}> = ({ count, caption, addButton }) => {
  const navigate = useNavigate();
  const facet = useFacetOrNull();
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
  const facet = useFacetOrNull();
  if (!item.id) return null;

  let progress = 0,
    progressTooltip = '0 / 0';

  if (item.progress && item.progress.doableCount > 0) {
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
      <Typography noWrap level="body-sm">
        <Link component={RouterLink} to={`${facet?.basePath}/${item.id}`}>
          {item.title}
        </Link>
      </Typography>
    </ListItem>
  );
};

const AllChecklistsWidget: React.FC<{
  activeChecklistId?: string | null;
}> = ({ activeChecklistId }) => {
  const { data, isLoading } = useAllChecklistsQuery();

  return (
    <List
      size="sm"
      sx={{
        '--List-gap': '0.125rem',
        '--ListItem-minHeight': '24px',
        '--ListItem-startActionWidth': 0,
        '--ListItem-startActionTranslateX': '-50%',
      }}>
      {isLoading && (
        <ListItem>
          <ListItemDecorator>
            <CircularProgress
              thickness={2}
              sx={{ '--CircularProgress-size': '1.25em' }}
            />
          </ListItemDecorator>
          Loading...
        </ListItem>
      )}
      {data && (
        <ListItem nested>
          <AllChecklistsGroup
            count={data?.checklists.length}
            caption="Personal checklists"
            addButton
          />
          {data.checklists.length > 0 && (
            <List>
              {data.checklists.map((item) => (
                <AllChecklistsItem
                  key={item.id}
                  item={item}
                  active={item.id === activeChecklistId}
                />
              ))}
            </List>
          )}
        </ListItem>
      )}
      {/*<ListItem nested>*/}
      {/*  <AllChecklistsGroup caption="Shared with me" count={0} />*/}
      {/*</ListItem>*/}
    </List>
  );
};

export default AllChecklistsWidget;
