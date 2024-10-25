import React, {useState} from "react";
import {useAuth} from "@/hooks";
import {UserCredentials} from "@/types/authTypes";
import {Avatar, Box, Button, CircularProgress, IconButton, Tooltip, Typography} from "@mui/joy";
import {KeyboardArrowUp as ArrowUpIcon, LogoutSharp as LogoutIcon} from "@mui/icons-material";
import SidebarLoginForm from "./SidebarLoginForm";

const SidebarUserPanel: React.FC = () => {
    const {isAuthenticated, isPending, user, login, logout} = useAuth();
    const [loginDrawerOpen, setLoginDrawerOpen] = useState(false);

    let userDisplayName = "";
    let userStringAvatar = "";
    if (isAuthenticated && user) {
        if (user.firstname || user.lastname) {
            const names = [user.firstname, user.lastname]
            userDisplayName = names.filter(value => value !== undefined).join(" ");
            userStringAvatar = names.map(value => value ? value.substring(0, 1).toUpperCase() : "").join("");
        } else {
            userDisplayName = user.username;
            userStringAvatar = user.username.substring(0, 1).toUpperCase();
        }
    }

    const handleSubmitCredentials = (credentials?: UserCredentials) => {
        if (credentials?.login && credentials?.password) {
            login(credentials);
        }
        setLoginDrawerOpen(false);
    }

    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minHeight: "38px",
        }}>
            {isAuthenticated && user ? (<>
                <Avatar
                    size="sm"
                    alt={userDisplayName}
                    src={`${process.env.PUBLIC_URL}/uploads/avatar/user/${user.username}.png`}>
                    {userStringAvatar}
                </Avatar>

                <Box sx={{pl: 0.5, flexGrow: 1, minWidth: 0}}>
                    <Typography level="title-sm" noWrap>{userDisplayName}</Typography>
                    <Typography level="body-xs" noWrap>{user?.email}</Typography>
                </Box>

                <Tooltip title="Logout">
                    <IconButton size="sm" variant="plain" onClick={logout}>
                        <LogoutIcon/>
                    </IconButton>
                </Tooltip>
            </>) : (<>
                {loginDrawerOpen ? (
                    <SidebarLoginForm onSubmitCredentials={handleSubmitCredentials} disabled={isPending}/>
                ) : (
                    <Button
                        onClick={() => setLoginDrawerOpen(true)}
                        size="md"
                        variant="plain"
                        disabled={isPending}
                        endDecorator={isPending ? <CircularProgress/> : <ArrowUpIcon/>}
                        sx={{flex: 1}}>
                        LOGIN
                    </Button>
                )}
            </>)}
        </Box>
    )
}

export default SidebarUserPanel;
