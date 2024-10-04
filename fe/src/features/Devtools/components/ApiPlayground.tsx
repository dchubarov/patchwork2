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
import {IndexedLayoutChildProps} from "../../../lib/pageLayoutTypes";
import {
    ArrowDropDown as DropdownIcon,
    CheckCircleOutline as SuccessIcon,
    PlayArrow as RunIcon,
    Warning as WarningIcon
} from "@mui/icons-material";

type RequestState =
    | { status: "empty" }
    | { status: "loading" }
    | { status: "success", response: any }
    | { status: "failure", response: any };

interface RequestMethodProps {
    payload?: boolean;
}

const RequestMethod: Record<string, RequestMethodProps> = {
    "GET": {payload: false},
    "POST": {payload: true},
    "PUT": {payload: true},
    "PATCH": {payload: true},
    "DELETE": {payload: false},
}

type RequestMethodName = keyof typeof RequestMethod;

interface HttpMethodSelectorProps {
    method: RequestMethodName;
    onChange?: (method: RequestMethodName) => void;
}

const HttpMethodSelector: React.FC<HttpMethodSelectorProps> = ({method, onChange}) => {
    return (
        <Dropdown>
            <Chip
                component={MenuButton}
                variant="soft"
                color="primary"
                endDecorator={<DropdownIcon/>}
                sx={{
                    borderRadius: "sm",
                    fontWeight: 600,
                    mr: 1
                }}>
                {method}
            </Chip>
            <Menu size="sm">
                {Object.keys(RequestMethod).filter((value) => value !== method).map((value) => (
                    <MenuItem
                        key={value}
                        onClick={() => onChange?.(value)}>
                        {value}
                    </MenuItem>
                ))}
            </Menu>
        </Dropdown>
    );
};

const ApiPlayground: React.FC<IndexedLayoutChildProps> = () => {
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

        axios.request(requestConfig)
            .then((response) => setRequestResult({status: "success", response: response}))
            .catch((reason) => setRequestResult({status: "failure", response: reason}))
            .finally(() => {
                apiUrlInputRef.current?.focus();
            });
    }

    return (<>
        <form onSubmit={handleSubmit}>
            <FormControl>
                <Input
                    slotProps={{input: {ref: apiUrlInputRef}}}
                    autoFocus
                    value={apiUrl}
                    disabled={requestResult.status === "loading"}
                    onChange={(e) => setApiUrl(e.target.value.trim())}
                    startDecorator={<>
                        <HttpMethodSelector
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
                    {(requestResult.status === "success" ? "Success: " : "Error: ") + (requestResult.response.status || "unknown")}
                </Typography>

                <Typography level="body-sm" fontWeight="bold" ml={3} mt={1}>Response:</Typography>
                <Typography component="pre" level="body-sm" fontFamily="monospace" ml={3}>
                    {JSON.stringify(requestResult.response.data || requestResult.response, null, 2)}
                </Typography>
            </Box>
        }
    </>);
}

export default ApiPlayground;
