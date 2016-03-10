/**
 * Chat Application
 *
 * @Author - Jake Jarrett
 * @GitHub URL - https://github.com/jakejarrett/chat-example
 */

"use strict";

$(function() {

    /** Setup App's variables **/
    const messageInput = $("#message");

    /** Focus the message input when we"ve loaded the page, So users can just start chatting! **/
    messageInput.focus();

    /**
     * Initialize Socket.io :) this is the secret sauce to the entire app!
     */
    var socket = io();

    /**
     * HTML strings for beginning and ending of each message
     * @type {string}
     */
    var htmlBeginning = "<div class='row msg_container base_sent'><div class='col-md-10 col-xs-10'><div class='messages msg_sent'>";
    var htmlEnding = "</div></div></div>";

    /** HTML Escape **/
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    /**
     * When the form is submitted, We will want to show the users message on the screen :)
     */
    $("form").submit(function (e) {
        /** Prevent the form from submitting **/
        e.preventDefault();

        /** Check if the input actually has stuff in it (EG/ not just a bunch of spaces) **/
        if (0 !== messageInput.val().trim().length) {
            /** Let the app know we want to send the message **/
            socket.emit("sendchat", messageInput.val());

            /** Clear the input **/
            messageInput.val("");
        }

        /** Always return false **/
        return false;
    });

    /**
     * The app will tell us when to update the view (Socket.io) and it will also give us the data to put there.
     */
    socket.on("updatechat", function (msg) {
        $("#messageContainer").append(htmlBeginning + escapeHtml(msg) + htmlEnding);

        /** Scroll to the bottom of the chat ~ **/
        $("html, body").animate({ scrollTop: $(document).height() });

        notifyUser("New Message", {
            body: msg
        });
    });

    /**
     * Whenever the user clicks on the app, we'll automatically focus on the message input
     *
     * NOTE- this is only for development purposes right now, will be removed later.
     */
    $("html").on("click", function (e) {
        messageInput.focus();
    });

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
    var escapeHtml = function(string) {

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
    };

    /**
     * Simple function to present a notification to the user when called
     *
     * @param {string} title
     * @param {object} options
     * @returns {boolean}
     */
    var notifyUser = function(title, options) {
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
});