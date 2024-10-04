import React, {useState} from "react";
import {Box, Button, Chip, FormControl, Input, Typography} from "@mui/joy";
import axios from "axios";
import "axios-retry";
import {CheckCircleOutline as SuccessIcon, PlayArrow as RunIcon, Warning as WarningIcon} from "@mui/icons-material";
import {IndexedLayoutChildProps} from "../../../lib/pageLayoutTypes";

type RequestState =
    | { status: "empty" }
    | { status: "loading" }
    | { status: "success", response: any }
    | { status: "failure", response: any };

const ApiPlayground: React.FC<IndexedLayoutChildProps> = () => {
    const [requestState, setRequestState] = useState<RequestState>({status: "empty"})
    const [apiUrl, setApiUrl] = useState("");

    const apiPrefix = process.env.REACT_APP_API_ROOT + "/";

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setRequestState({status: "loading"});

        axios.get(apiPrefix + apiUrl, {"axios-retry": {retries: 3}})
            .then((response) => setRequestState({status: "success", response: response}))
            .catch((reason) => setRequestState({status: "failure", response: reason}))
    }

    return (<>
        <form onSubmit={handleSubmit}>
            <FormControl>
                <Input
                    value={apiUrl}
                    required
                    autoFocus
                    startDecorator={<><Chip variant="solid" color="success" sx={{mr: 1}}>GET</Chip> {apiPrefix}</>}
                    disabled={requestState.status === "loading"}
                    onChange={(e) => setApiUrl(e.target.value)}
                    endDecorator={
                        <Button
                            type="submit"
                            loading={requestState.status === "loading"}
                            endDecorator={<RunIcon/>}>
                            Submit
                        </Button>
                    }/>
            </FormControl>
        </form>

        {(requestState.status === "success" || requestState.status === "failure") &&
            <Box mt={2}>
                <Typography
                    level="body-sm"
                    fontWeight="bold"
                    color={requestState.status === "success" ? "success" : "danger"}
                    startDecorator={requestState.status === "success" ? <SuccessIcon/> : <WarningIcon/>}>
                    {(requestState.status === "success" ? "Success: " : "Error: ") + (requestState.response.status || "unknown")}
                </Typography>

                <Typography level="body-sm" fontWeight="bold" ml={3} mt={1}>Response:</Typography>
                <Typography component="pre" level="body-sm" ml={3} /*fontFamily="monospace"*/>
                    {JSON.stringify(requestState.response.data || requestState.response, null, 2)}
                </Typography>
            </Box>}
    </>);
}

export default ApiPlayground;
