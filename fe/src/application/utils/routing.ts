import { ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppFacets from 'src/facets';
import { envGlobals } from '@/types/env';
import AuthorizedRoute from '../components/AuthorizedRoute';

export function buildRouter(
  rootElement: ReactNode,
  errorElement: ReactNode,
  initialPage?: ReactNode
) {
  return createBrowserRouter(
    [
      {
        element: rootElement,
        errorElement: errorElement,
        children: [
          {
            index: true,
            element: initialPage || null,
          },

          ...AppFacets.map((facet) => ({
            Component: facet.authorization ? AuthorizedRoute : null,
            path: facet.basePath || facet.name,
            children: facet.routes(),
          })),
        ],
      },
    ],
    /* opts */
    {
      basename: envGlobals.UI_ROOT,
    }
  );
}
