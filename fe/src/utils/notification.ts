import {internalShowNotification, NotificationOptions} from "@/components/Notification";

export const showNotification = (title: string, opts?: NotificationOptions) =>
    internalShowNotification(title, opts);

export {type NotificationOptions} from "@/components/Notification";
