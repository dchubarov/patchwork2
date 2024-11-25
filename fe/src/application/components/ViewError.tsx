import _ from 'lodash';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Link,
} from '@mui/joy';
import { ErrorOutline as WarningIcon } from '@mui/icons-material';
import Typography from '@mui/joy/Typography';
import { useActiveView } from '@/hooks';
import PageLayout from '@/components/PageLayout';

const ViewError: React.FC<{
  reason?: Error;
  reset?: () => void;
}> = ({ reason, reset }) => {
  const location = useLocation();
  const { facet } = useActiveView();

  return (
    <PageLayout.Centered>
      <Card
        variant="soft"
        color="warning"
        invertedColors
        sx={{ maxWidth: '60%', p: 4 }}>
        <CardContent orientation="horizontal">
          <WarningIcon sx={{ fontSize: '4rem', opacity: 0.6 }} />
          <CardContent>
            <Typography level="title-lg" color="warning">
              {_.trimStart(location.pathname, '/')}
            </Typography>
            <Typography level="h2" color="warning">
              This page cannot be loaded
            </Typography>
          </CardContent>
        </CardContent>
        <Divider sx={{ mb: 1 }} />
        <CardContent sx={{ gap: 2 }}>
          <Typography level="body-lg">
            {reason?.message ?? 'Unknown error'}
          </Typography>

          <Typography
            component="div"
            level="body-sm"
            sx={{ color: 'text.tertiary' }}>
            Instead of this page, you can try the following locations:
            <ul>
              {facet && facet.basePath !== location.pathname && (
                <li>
                  <Link
                    component={RouterLink}
                    to={facet.basePath}
                    level="body-sm">
                    {facet.localizedDisplayName}
                  </Link>
                </li>
              )}
              <li>
                <Link component={RouterLink} to="/" level="body-sm">
                  Home
                </Link>
              </li>
            </ul>
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', gap: 2 }}>
          <Typography>{' ' /* acts as spacer */}</Typography>
          <Button onClick={() => reset?.()}>Try again</Button>
        </CardActions>
      </Card>
    </PageLayout.Centered>
  );
};

export default ViewError;
