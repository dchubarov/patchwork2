import React, {useRef, useState} from "react";
import {
    Box,
    Chip,
    Dropdown,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    Textarea,
    Typography
} from "@mui/joy";
import axios, {AxiosRequestConfig} from "axios";
import "axios-retry";
import {
    ArrowDropDown as DropdownIcon,
    CheckCircleOutline as SuccessIcon,
    PlayArrow as RunIcon,
    Warning as WarningIcon
} from "@mui/icons-material";
import {labelColorsByName} from "../../../lib/theme";

type RequestState =
    | { status: "empty" }
    | { status: "loading" }
    | { status: "success", response: any, elapsedTime?: number }
    | { status: "failure", response: any, elapsedTime?: number };

interface RequestMethodProps {
    payload?: boolean;
    color?: string;
}

const RequestMethod: Record<string, RequestMethodProps> = {
    "GET": {payload: false, color: "lime"},
    "POST": {payload: true, color: "teal"},
    "PUT": {payload: true, color: "indigo"},
    "PATCH": {payload: true, color: "fuchsia"},
    "DELETE": {payload: false, color: "pink"},
}

type RequestMethodName = keyof typeof RequestMethod;

type RequestMethodSelectorType = React.FC<{
    method: RequestMethodName,
    onChange?: (method: RequestMethodName) => void;
}>;

const RequestMethodSelector: RequestMethodSelectorType = ({method, onChange}) => {
    const palette = labelColorsByName(RequestMethod[method].color);
    return (
        <Dropdown>
            <Chip
                component={MenuButton}
                variant="soft"
                // color={RequestMethod[method].color || "neutral"}
                endDecorator={<DropdownIcon/>}
                sx={{
                    mr: 1,
                    borderRadius: "sm",
                    fontWeight: 600,
                    backgroundColor: palette[300],
                    color: palette[800],
                    "&:hover": {backgroundColor: palette[200]},
                }}>
                {method}
            </Chip>
            <Menu size="sm" sx={{zIndex: 9999}}>
                {Object.keys(RequestMethod).filter((value) => value !== method).map((value) => (
                    <MenuItem
                        key={value}
                        onClick={() => onChange?.(value)}
                        sx={{color: labelColorsByName(RequestMethod[value].color)[800]}}>
                        {value}
                    </MenuItem>
                ))}
            </Menu>
        </Dropdown>
    );
};

const ApiPlayground: React.FC = () => {
    const apiUrlInputRef = useRef<HTMLInputElement | null>(null);
    const [requestResult, setRequestResult] = useState<RequestState>({status: "empty"});
    const [requestMethod, setRequestMethod] = useState<RequestMethodName>("GET");
    const [requestBody, setRequestBody] = useState("");
    const [apiUrl, setApiUrl] = useState("");
    const apiPrefix = process.env.REACT_APP_API_ROOT + "/";

    const handleRequestMethodChange = (method: RequestMethodName) => {
        setRequestResult({status: "empty"});
        setRequestMethod(method);
        setRequestBody("");
        setApiUrl("");

        apiUrlInputRef.current?.focus();
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setRequestResult({status: "loading"});

        let requestConfig: AxiosRequestConfig = {
            method: requestMethod,
            url: apiPrefix + apiUrl,
            "axios-retry": {
                retries: 3,
            }
        }

        if (RequestMethod[requestMethod].payload) {
            requestConfig = {
                ...requestConfig,
                data: requestBody,
                headers: {
                    ...requestConfig.headers,
                    "Content-Type": "application/json",
                }
            }
        }

        const start = performance.now();
        axios.request(requestConfig)
            .then((response) =>
                setRequestResult({
                    status: "success",
                    response: response,
                    elapsedTime: Math.round(performance.now() - start)
                }))
            .catch((reason) =>
                setRequestResult({
                    status: "failure",
                    response: reason,
                    elapsedTime: Math.round(performance.now() - start)
                }))
            .finally(() => {
                apiUrlInputRef.current?.focus();
            });
    }

    return (
        <Box p={2}>
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <Input
                        autoFocus
                        value={apiUrl}
                        name="api-url"
                        slotProps={{input: {ref: apiUrlInputRef}}}
                        disabled={requestResult.status === "loading"}
                        onChange={(e) => setApiUrl(e.target.value.trim())}
                        startDecorator={<>
                            <RequestMethodSelector
                                method={requestMethod}
                                onChange={handleRequestMethodChange}/>
                            {apiPrefix}
                        </>}
                        endDecorator={
                            <IconButton
                                type="submit"
                                disabled={apiUrl === ""}
                                loading={requestResult.status === "loading"}
                                variant="solid"
                                color="primary">
                                <RunIcon/>
                            </IconButton>
                        }
                        sx={{
                            "--Input-gap": 0,
                            pl: 2
                        }}/>
                </FormControl>

                {RequestMethod[requestMethod].payload &&
                    <FormControl sx={{mt: 1}}>
                        <FormLabel>Request (JSON):</FormLabel>
                        <Textarea
                            value={requestBody}
                            onChange={(e) => setRequestBody(e.target.value)}
                            minRows={3}
                            maxRows={8}
                            size="sm"
                            sx={{
                                fontFamily: "monospace"
                            }}/>
                    </FormControl>}
            </form>

            {(requestResult.status === "success" || requestResult.status === "failure") &&
                <Box mt={2}>
                    <Typography
                        level="body-sm"
                        fontWeight="bold"
                        color={requestResult.status === "success" ? "success" : "danger"}
                        startDecorator={requestResult.status === "success" ? <SuccessIcon/> : <WarningIcon/>}>
                        {(requestResult.status === "success" ? "Success: " : "Error: ") + (requestResult.response.status || "unknown") +
                            (requestResult.elapsedTime ? ` (${requestResult.elapsedTime} ms)` : "")}
                    </Typography>

                    <Typography level="body-sm" fontWeight="bold" ml={3} mt={1}>Response:</Typography>
                    <Typography component="pre" level="body-sm" fontFamily="monospace" ml={3}>
                        {JSON.stringify(requestResult.response.data || requestResult.response, null, 2)}
                    </Typography>
                </Box>
            }
        </Box>
    );
}

export default ApiPlayground;
