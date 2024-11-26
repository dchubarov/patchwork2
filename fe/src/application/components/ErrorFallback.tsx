import _ from 'lodash';
import React from 'react';
import {
  isRouteErrorResponse,
  Link as RouterLink,
  useLocation,
} from 'react-router-dom';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Link,
} from '@mui/joy';
import { BrokenImage as WarningIcon } from '@mui/icons-material';
import Typography from '@mui/joy/Typography';
import PageLayout from '@/components/PageLayout';
import { useActiveViewSafe } from '@/hooks/view';

const ErrorFallback: React.FC<{
  reason?: unknown;
  reset?: () => void;
}> = ({ reason, reset }) => {
  const location = useLocation();
  const view = useActiveViewSafe();

  let errorMessage;
  if (isRouteErrorResponse(reason)) {
    errorMessage = reason.statusText;
  } else if (reason instanceof Error) {
    errorMessage = reason.message;
  } else if (typeof reason === 'string') {
    errorMessage = reason;
  } else {
    errorMessage = 'Unknown error';
  }

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
          <Typography level="body-lg">{errorMessage}</Typography>

          <Typography
            component="div"
            level="body-sm"
            sx={{ color: 'text.tertiary' }}>
            Instead of this page, you can try the following locations:
            <ul>
              {view?.facet && view.facet.basePath !== location.pathname && (
                <li>
                  <Link
                    component={RouterLink}
                    to={view.facet.basePath}
                    level="body-sm">
                    {view.facet.localizedDisplayName}
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
          {reset && <Button onClick={() => reset()}>Try again</Button>}
        </CardActions>
      </Card>
    </PageLayout.Centered>
  );
};

export default ErrorFallback;
