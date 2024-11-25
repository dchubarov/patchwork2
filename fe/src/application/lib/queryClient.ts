import { QueryClient } from '@tanstack/react-query';

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: 'always',
        throwOnError: true,
        retry: false,
      },
    },

    /* Setting up custom error handler, also needed for mutationCache:
    queryCache: new QueryCache({
      onError(error, query) {
      },
    }),*/
  });
