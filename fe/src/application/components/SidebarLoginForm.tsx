import {UserCredentials} from "@/types/auth";
import React, {FormEvent, KeyboardEvent, useState} from "react";
import {Box, Button, FormControl, Input} from "@mui/joy";
import {KeyboardArrowDown as ArrowDownIcon, Login as LoginIcon} from "@mui/icons-material";

interface LoginFormProps {
    disabled?: boolean;
    onSubmitCredentials?: (credentials?: UserCredentials) => void;
}

const SidebarLoginForm: React.FC<LoginFormProps> = ({disabled, onSubmitCredentials}) => {
    const [usernameValue, setUsernameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        onSubmitCredentials?.({login: usernameValue, password: passwordValue});
        setUsernameValue("");
        setPasswordValue("");
        e.preventDefault();
    }

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Escape") {
            onSubmitCredentials?.(undefined);
            setUsernameValue("");
            setPasswordValue("");
            e.preventDefault();
        }
    }

    return (
        <Box sx={{flex: 1, display: "flex", flexDirection: "column", gap: 1}}>
            <form onSubmit={handleSubmit} style={{display: "contents"}}>
                <FormControl>
                    <Input
                        autoFocus
                        autoComplete="off"
                        disabled={disabled}
                        value={usernameValue}
                        onChange={(e) => setUsernameValue(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        placeholder="Username or E-mail"
                        name="username"
                        type="text"
                        size="sm"
                    />
                </FormControl>
                <FormControl>
                    <Input
                        value={passwordValue}
                        onChange={(e) => setPasswordValue(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        disabled={disabled}
                        placeholder="Password"
                        name="password"
                        type="password"
                        size="sm"
                    />
                </FormControl>
                <FormControl>
                    <Button
                        disabled={disabled}
                        type="submit"
                        variant="solid"
                        endDecorator={usernameValue && passwordValue ? <LoginIcon/> : <ArrowDownIcon/>}>
                        LOGIN
                    </Button>
                </FormControl>
            </form>
        </Box>
    )
}

export default SidebarLoginForm;
