/**
 * Escape HTML
 *  We don't want a user to run random scripts in the page, so lets escape all messages.
 *
 * Based on Mustache's code
 * @Mustache.js - https://github.com/janl/mustache.js/blob/master/mustache.js#L60
 *
 * @param {string} string
 * @returns {string}
 */

"use strict";

export default function(string) {

    /** Array of entities we will escape **/
    let entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    /** Return the escaped string **/
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}