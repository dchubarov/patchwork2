import {QueryClient} from "@tanstack/react-query";

const queryClient = new QueryClient({
    /* Setting up custom error handler, also needed for mutationCache:
    queryCache: new QueryCache({
        onError(error, query) {
            console.error(error);
        },
    }),
    */
});

export default queryClient;
