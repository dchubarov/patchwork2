import React, {FormEvent, useEffect, useState} from "react";
import {Button, FormControl, FormLabel, Input, Sheet, Typography} from "@mui/joy";
import InfoIcon from "@mui/icons-material/Info";
import PageLayout from "./components/PageLayout";
import {useActiveView} from "./providers/ActiveViewProvider";
import {useAuth} from "./providers/AuthProvider";

const SampleView: React.FC = () => {
    const {configureWidgets, ejectView} = useActiveView();

    useEffect(() => {
        configureWidgets([
            {component: <div style={{backgroundColor: "rgba(0,0,255,0.1)"}}>Sample add-on</div>, slot: 2},
            {component: <div style={{height: 200, backgroundColor: "rgba(255,0,255,0.1)"}}>Sample add-on 2</div>},
        ]);

        return () => {
            ejectView();
        }
    }, [configureWidgets, ejectView]);

    const {isAuthenticated, isPending, user, login} = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: FormEvent<HTMLFormElement>)=> {
        if (username && password) {
            login({login: username, password: password})
        }
        setUsername("");
        setPassword("");
        e.preventDefault();
    }

    return (
        <PageLayout.Centered>
            <Sheet variant="outlined" sx={{borderRadius: 'md', boxShadow: 'md', display: "flex", p: 3, gap: 1}}>
                {isAuthenticated ? (
                    <Typography level="h4" component="h1" color="success" startDecorator={<InfoIcon/>}>
                        Authenticated as: {user?.email}
                    </Typography>
                ) : (
                    <form onSubmit={handleLogin}>
                        <FormControl>
                            <FormLabel>Login</FormLabel>
                            <Input
                                name="login"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} />
                        </FormControl>
                        <FormControl sx={{pt: 1}}>
                            <FormLabel>Password</FormLabel>
                            <Input
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}/>
                        </FormControl>
                        <FormControl sx={{pt: 3}}>
                            <Button type="submit" loading={isPending}>Login</Button>
                        </FormControl>
                    </form>
                )}
            </Sheet>
        </PageLayout.Centered>
    );
}

export default SampleView;
