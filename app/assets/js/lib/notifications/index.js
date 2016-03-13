/**
 * Simple function to present a notification to the user when called
 *
 * @param {string} title
 * @param {object} options
 * @returns {boolean}
 */
export default function(title, options) {
    /**
     * If the user has given us permission to use notifications, Lets notify them of a new message!
     */
    if ("granted" === Notification.permission) {
        var notification = new Notification(title, options);
    }
    /**
     * If they haven't said no yet, Lets ask before ending the function.
     */
    else if ("denied" !== Notification.permission) {
        Notification.requestPermission(function (permission) {
            /** If the user agrees to notifications, Lets setup a new notification. **/
            if (permission === "granted") {
                var notification = new Notification(title, options);
            }
        });
    }

    /**
     * Because the user doesn't want notifications, We will exit the function now.
     */
    return false;
};