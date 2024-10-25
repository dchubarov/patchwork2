import {internalDisplayNotification, NotificationOptions} from "@/components/Notification";

export const displayNotification = (title: string, opts?: NotificationOptions) =>
    internalDisplayNotification(title, opts);

export {type NotificationOptions} from "../components/Notification";
