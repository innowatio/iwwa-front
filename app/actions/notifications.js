export const SHOW_NOTIFICATION_MODAL = "SHOW_NOTIFICATION_MODAL";
export const CLOSE_NOTIFICATION_MODAL = "CLOSE_NOTIFICATION_MODAL";

export function showNotificationModal (data) {
    return {
        type: SHOW_NOTIFICATION_MODAL,
        payload: data
    };
}

export function closeNotificationModal () {
    return {
        type: CLOSE_NOTIFICATION_MODAL
    };
}
