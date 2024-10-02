import React from "react";
import {isRouteErrorResponse, useRouteError, Link as RouterLink} from "react-router-dom";
import {Box, CssBaseline, CssVarsProvider, Link, Typography} from "@mui/joy";
import ErrorIcon from "@mui/icons-material/Error";

const ErrorPage: React.FC = () => {
    const error = useRouteError();
    let errorMessage: string;

    if (isRouteErrorResponse(error)) {
        errorMessage = error.statusText
    } else if (error instanceof Error) {
        errorMessage = error.message
    } else if (typeof error === "string") {
        errorMessage = error
    } else {
        errorMessage = "Unknown error"
        console.error(error);
    }

    return (
        <CssVarsProvider>
            <CssBaseline/>
            <Box sx={{
                minHeight: "100dvh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3
            }}>
                <ErrorIcon sx={{width: 96, height: 96}}/>
                <Typography level="h1">Oops!</Typography>
                <Typography level="h4">Sorry, an unexpected error has occurred.</Typography>
                <Typography variant="soft">{errorMessage}</Typography>
                <Link component={RouterLink} to="/">Home</Link>
            </Box>
        </CssVarsProvider>
    )
}

export default ErrorPage;
