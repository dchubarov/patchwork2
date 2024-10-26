import React from "react";
import {Card, CardContent, IconButton, SvgIconProps, Typography} from "@mui/joy";
import {
    Dangerous as ErrorIcon,
    WarningAmber as WarningIcon,
    InfoOutlined as InfoIcon,
    Close as CloseIcon
} from "@mui/icons-material";
import {DefaultColorPalette} from "@mui/joy/styles/types";
import {resolveValue, Toast, toast} from "react-hot-toast";

type NotificationType = "success" | "warning" | "error" | "info";

export interface NotificationOptions {
    subtitle?: string;
    type?: NotificationType;
    autoHideDelay?: number;
    noIcon?: boolean;
    noCloseButton?: boolean;
}

export function internalShowNotification(title: string, opts?: NotificationOptions) {
    let classes = [`nf-type-${opts?.type || "info"}`];
    if (!opts?.noCloseButton) {
        classes.push("nf-closeable");
    }

    if (opts?.noIcon) {
        classes.push("nf-no-icon")
    }

    const message = <MessageContent title={title} subtitle={opts?.subtitle}/>;
    toast(message, {
        className: classes.join(" "),
        duration: opts?.autoHideDelay,
    });
}

interface MessageContentProps {
    title: string;
    subtitle?: string;
}

const MessageContent: React.FC<MessageContentProps> = ({title, subtitle}) => {
    return (<>
        <Typography level="title-md" noWrap>
            {title}
        </Typography>
        {subtitle && <Typography level="body-sm" noWrap>
            Server returned error 401
        </Typography>}
    </>);
}

const ToastBar: React.FC<{ toast: Toast }> = ({toast: t}) => {
    const classes = t.className ? t.className.split(" ") : [];
    const iconProps: SvgIconProps = {size: "lg"}
    let color: DefaultColorPalette;
    let icon;

    if (classes.includes("nf-type-error")) {
        icon = <ErrorIcon {...iconProps}/>
        color = "danger";
    } else if (classes.includes("nf-type-warning")) {
        icon = <WarningIcon  {...iconProps}/>
        color = "warning";
    } else if (classes.includes("nf-type-success")) {
        icon = <InfoIcon {...iconProps}/>
        color = "success";
    } else {
        icon = <InfoIcon {...iconProps}/>
        color = "primary";
    }

    return (
        <Card
            color={color}
            invertedColors
            variant="soft"
            orientation="horizontal"
            sx={{
                minWidth: "280px",
                maxWidth: "80%",
                alignItems: "center",
                boxShadow: "md",
            }}>

            {classes.includes("nf-no-icon") || icon}

            <CardContent sx={{minWidth: 0}}>
                {resolveValue(t.message, t)}
            </CardContent>

            {classes.includes("nf-closeable") && <IconButton size="sm" onClick={() => toast.remove(t.id)}>
                <CloseIcon/>
            </IconButton>}
        </Card>
    )
}

const Notification = {
    MessageContent,
    ToastBar
}

export default Notification;
